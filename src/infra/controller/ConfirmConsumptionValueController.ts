import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { ConfirmConsumptionValueService } from "../../application/services/ConfirmConsumptionValueService.js";
import { MeasureNotFoundError } from "../../domain/erros/MeasureNotFoundError.js";
import { MeasureAlreadyConfirmedError } from "../../domain/erros/MeasureAlreadyConfirmedError.js";
import { ValueNotEqualError } from "../../domain/erros/ValueNotEqualError.js";

const confirmConsumptionValueBodySchema = z.object({
    measure_uuid: z.string({ message: "Informe um UUID válido" }).uuid(),
    measure_value: z.coerce.number({ message: "Valor precisa ser do tipo inteiro" })
})

export class ConfirmConsumptionValueController {

   async confirm(req: Request, res: Response) {
       
       const geminiMapper = new GeminiMapper()
       const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
       const confirmConsumptionValueService = new ConfirmConsumptionValueService(geminiPrismaRepository)
       
       try {
        const { measure_uuid: measureId, measure_value: measureValue  } = confirmConsumptionValueBodySchema.parse(req.body)
        
        const { success } = await confirmConsumptionValueService.execute({
            measureId,
            measureValue
        })

        return res.status(201).json({
            success
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
        
        if(e instanceof MeasureNotFoundError) {
            res.status(404).json({
                description: "Leitura não encontrada",
                "error_code": "MEASURE_NOT_FOUND",
                "error_description": e.message
            })
            return
        }
        
        if(e instanceof ValueNotEqualError) {
            res.status(404).json({
                description: "Valor diferente ao da leitura",
                "error_code": "WRONG_VALUE",
                "error_description": e.message
            })
            return
        }
        if(e instanceof MeasureAlreadyConfirmedError) {
            res.status(409).json({
                description: "Leitura já confirmada",
                "error_code": "CONFIRMATION_DUPLICATE",
                "error_description": e.message
            })
            return
        }

        return res.status(500).json({
            message: "Server internal Error"
        })
    }
   }
}