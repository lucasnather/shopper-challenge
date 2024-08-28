import { z } from "zod";
import type { Request, Response } from 'express'
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { FindManyConsumptionsValueService } from "../../application/services/FindManyConsumptions.js";

const findManyConsumptionValueParamSchema = z.object({
   customer_code: z.string(),
})

const findManyConsumptionValueQuerySchema = z.object({
    measure_type: z.nativeEnum(MeasureType).optional()
})

export class FindManyConsumptionValueController {

   async getMany(req: Request, res: Response) {
    const { customer_code: code} = findManyConsumptionValueParamSchema.parse(req.params)
    const { measure_type: measureType} = findManyConsumptionValueQuerySchema.parse(req.query)

    const geminiMapper = new GeminiMapper()
    const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
    const findManyConsumptionsValueService = new FindManyConsumptionsValueService(geminiPrismaRepository)

    try {
        const { customerCode, measures } = await findManyConsumptionsValueService.execute({
            customerCode: code,
            measureType
        })

        return res.status(200).json({
            customerCode,
            measures
        })
    } catch(e) {
        return res.status(404).send({
            message: "Erro por enquanto"
        })
    }
   }
}