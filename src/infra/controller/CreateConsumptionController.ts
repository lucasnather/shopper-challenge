import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { Converter } from "../../domain/utils/Converter.js";
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js";
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { CreateConsumptionService } from "../../application/services/CreateConsumptionService.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { InvalidReadbleMonthError } from "../../domain/erros/InvalidReadbleMonthError.js";

const createConsumptionBodySchema = z.object({
    measure_datetime: z.coerce.date({message: 'Campo de Data Inválido'}),
    measure_type: z.nativeEnum(MeasureType, { message: 'Envia campos WATER ou GAS' }),
    customer_code: z.string({ message: 'Insira um código de 6 dígitos' }).min(6).max(6),
    image: z.string({ message: "Converta a imagem para base64" }),
})

export class CreateConsumptionController {

   async upload(req: Request, res: Response) {
       const converter = new Converter()
       const geminiImageAnalyse = new GeminiImageAnalyze()
       const geminiMapper = new GeminiMapper()
       const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
       const createGeminiService = new CreateConsumptionService(geminiPrismaRepository,geminiImageAnalyse, converter)
       
       try {
        const { customer_code: customerCode, image, measure_datetime: measureDatetime, measure_type: measureType } = createConsumptionBodySchema.parse(req.body)
        
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

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
   }
}