import { z } from "zod";
import type { Request, Response } from 'express'
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { ConfirmConsumptionValueService } from "../../application/services/ConfirmConsumptionValueService.js";

const confirmConsumptionValueBodySchema = z.object({
    measure_uuid: z.string().uuid(),
    measure_value: z.coerce.number()
})

export class ConfirmConsumptionValueController {

   async confirm(req: Request, res: Response) {
    const { measure_uuid: measureId, measure_value: measureValue  } = confirmConsumptionValueBodySchema.parse(req.body)

    const geminiMapper = new GeminiMapper()
    const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
    const confirmConsumptionValueService = new ConfirmConsumptionValueService(geminiPrismaRepository)

    try {
        const { success } = await confirmConsumptionValueService.execute({
            measureId,
            measureValue
        })

        return res.status(201).json({
            success
        })
    } catch(e) {
        return res.status(404).send({
            message: "Erro por enquanto"
        })
    }
   }
}