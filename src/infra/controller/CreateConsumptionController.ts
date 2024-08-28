import { z } from "zod";
import type { Request, Response } from 'express'
import { Converter } from "../../domain/utils/Converter.js";
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js";
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { CreateConsumptionService } from "../../application/services/CreateConsumptionService.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

const createConsumptionBodySchema = z.object({
    measure_datetime: z.coerce.date(),
    measure_type: z.nativeEnum(MeasureType),
    customer_code: z.string(),
    image: z.string(),
})

export class CreateConsumptionController {

   async post(req: Request, res: Response) {
    const { customer_code: customerCode, image, measure_datetime: measureDatetime, measure_type: measureType } = createConsumptionBodySchema.parse(req.body)

    const converter = new Converter()
    const geminiImageAnalyse = new GeminiImageAnalyze()
    const geminiMapper = new GeminiMapper()
    const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
    const createGeminiService = new CreateConsumptionService(geminiPrismaRepository,geminiImageAnalyse, converter)

    try {
        const { imageUrl, measureUUID, measureValue } = await createGeminiService.execute({
            customerCode,
            image,
            measureDatetime,
            measureType
        })

        return res.status(201).json({
            "image_url": imageUrl,
            "measure_value": measureValue,
            "measure_uuid": measureUUID
        })
    } catch(e) {
        return res.status(404).send({
            message: "Erro por enquanto"
        })
    }
   }
}