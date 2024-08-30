import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { GeminiPrismaRepository } from "../repository/GeminiPrismaRepository.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { FindManyMeasureValueService } from "../../application/services/FindManyMeasureService.js";
import { CustomerMeasureNotFoundError } from "../../domain/erros/CustomerMeasureNotFound.js";
import { CustomerMapper } from "../gateway/CustomerMapper.js";
import { CustomerPrismaRepository } from "../repository/CustomerPrismaRepository.js";
import { CustomerNotFound } from "../../domain/erros/CustomerNotFound.js";

const findManyMeasureValueParamSchema = z.object({
   customer_code: z.string().uuid(),
})

const findManyMeasureValueQuerySchema = z.object({
    measure_type: z
    .string({ message: "Tipo de medição não permitida"})
    .transform((type) => type.toUpperCase())
    .transform((type) => type as MeasureType)
    .optional()
    
})

export class FindManyMeasureValueController {

   async getMany(req: Request, res: Response) {
       
       const geminiMapper = new GeminiMapper()
       const customerMapper = new CustomerMapper()
       const geminiPrismaRepository = new GeminiPrismaRepository(geminiMapper)
       const customerPrismaRepository = new CustomerPrismaRepository(customerMapper)
       const findManyMeasuresValueService = new FindManyMeasureValueService(geminiPrismaRepository, customerPrismaRepository)
       
       try {
        const { customer_code: code} = findManyMeasureValueParamSchema.parse(req.params)
        const { measure_type: measureType} = findManyMeasureValueQuerySchema.parse(req.query)

        const { customerCode, measures } = await findManyMeasuresValueService.execute({
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

        if(e instanceof CustomerNotFound) {
            res.status(409).json({
                description: "Usuário não encontrado -> encontre seu código nesta rota http://localhost:8080/code",
                "error_code": "NOT_FOUND",
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