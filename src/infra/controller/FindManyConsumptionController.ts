import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { FindManyConsumptionsValueService } from "../../application/services/FindManyConsumptionsService.js";
import { CustomerMeasureNotFoundError } from "../../domain/erros/CustomerMeasureNotFound.js";

const findManyConsumptionValueParamSchema = z.object({
   customer_code: z.string(),
})

const findManyConsumptionValueQuerySchema = z.object({
    measure_type: z
    .string({ message: "Tipo de medição não permitida"})
    .transform((type) => type.toUpperCase())
    .transform((type) => type as MeasureType)
    .optional()
    
})

export class FindManyConsumptionValueController {

   async getMany(req: Request, res: Response) {
       
       const geminiMapper = new GeminiMapper()
       const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
       const findManyConsumptionsValueService = new FindManyConsumptionsValueService(geminiPrismaRepository)
       
       try {
        const { customer_code: code} = findManyConsumptionValueParamSchema.parse(req.params)
        const { measure_type: measureType} = findManyConsumptionValueQuerySchema.parse(req.query)

        const { customerCode, measures } = await findManyConsumptionsValueService.execute({
            customerCode: code,
            measureType
        })

        return res.status(200).json({
            customerCode,
            measures
        })
    } catch(e) {

        if(e instanceof ZodError) {
            res.status(400).json({
                description: "Parâmetro measure type de WATER ou GAS",
                "error_code": "INVALID_TYPE",
                "error_description": e.errors
            })
            return
        }

        if(e instanceof CustomerMeasureNotFoundError) {
            res.status(400).json({
                description: "Nenhum registro encontrado",
                "error_code": "MEASURES_NOT_FOUND",
                "error_description": e.message
            })
            return
        }

        
        return res.status(500).send({
            message: "Server internal error"
        })
    }
   }
}