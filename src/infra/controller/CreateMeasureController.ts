import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { Converter } from "../../domain/utils/Converter.js";
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js";
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { CreateMeasureService } from "../../application/services/CreateMeasureService.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { InvalidReadbleMonthError } from "../../domain/erros/InvalidReadbleMonthError.js";
import { CustomerMapper } from "../gateway/CustomerMapper.js";
import { CustomerPrismaRepository } from "../repository/CustomerPrismaRepository.js";
import { CustomerNotFound } from "../../domain/erros/CustomerNotFound.js";

const createMeasureBodySchema = z.object({
    measure_datetime: z.coerce.date({message: 'Campo de Data Inválido'}),
    measure_type: z.nativeEnum(MeasureType, { message: 'Envia campos WATER ou GAS' }),
    customer_code: z.string({ message: 'Insira seu código -> se não crie ele primeiro' }).uuid(),
    image: z.string({ message: "Converta a imagem para base64" }),
})

export class CreateMeasureController {

   async upload(req: Request, res: Response) {
       const converter = new Converter()
       const geminiImageAnalyse = new GeminiImageAnalyze()
       const geminiMapper = new GeminiMapper()
       const customerMapper = new CustomerMapper()
       const customerPrismaRepository = new CustomerPrismaRepository(customerMapper)
       const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
       const createGeminiService = new CreateMeasureService(geminiPrismaRepository, customerPrismaRepository,geminiImageAnalyse, converter,)
       
       try {
        const { customer_code: customerCode, image, measure_datetime: measureDatetime, measure_type: measureType } = createMeasureBodySchema.parse(req.body)
        
        const { imageUrl, measureUUID, measureValue } = await createGeminiService.execute({
            customerCode,
            image,
            measureDatetime,
            measureType
        })

        return res.status(201).json({
            description: "Operação realizada com sucesso",
            "image_url": imageUrl,
            "measure_value": measureValue,
            "measure_uuid": measureUUID
        })
    } catch(e) {
        if(e instanceof ZodError) {
            res.status(400).json({
                description: "Os dados fornecidos no corpo da requisição são inválidos",
                "error_code": "INVALID_DATA",
                "error_description": e.errors
            })
            return
        }

        if(e instanceof InvalidReadbleMonthError) {
            res.status(409).json({
                description: "Já existe uma leitura para este tipo no mês atual",
                "error_code": "DOUBLE_REPORT",
                "error_description": e.message
            })
            return
        }

        if(e instanceof CustomerNotFound) {
            res.status(409).json({
                description: "Usuário não encontrado -> encontre seu código nesta rota http://localhost:8080/code",
                "error_code": "NOT_FOUND",
                "error_description": e.message
            })
            return
        }
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
   }
}