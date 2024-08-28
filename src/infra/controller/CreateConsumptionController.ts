import { z } from "zod";
import type { Request, Response } from 'express'
import { Converter } from "../../domain/utils/Converter.js";
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js";
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { CreateConsumptionService } from "../../application/services/CreateConsumptionService.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

const createConsumptionBodySchema = z.object({
    measureDatetime: z.date(),
    measureType: z.nativeEnum(MeasureType),
    customerCode: z.string(),
    image: z.string(),
})

export class CreateConsumptionController {

   async post(req: Request, res: Response) {
    const { customerCode, image, measureDatetime, measureType } = createConsumptionBodySchema.parse(req.body)

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

        res.status(201).json({
            "image_url": imageUrl,
            "measure_value": measureValue,
            "measure_uuid": measureUUID
        })
    } catch(e) {
        res.status(404).send({
            message: "Erro por enquanto"
        })
    }
   }
}