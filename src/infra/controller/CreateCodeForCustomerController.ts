import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { MeasureNotFoundError } from "../../domain/erros/MeasureNotFoundError.js";
import { CustomerMapper } from "../gateway/CustomerMapper.js";
import { CustomerPrismaRepository } from "../repository/CustomerPrismaRepository.js";
import { CreateCodeForCustomerService } from "../../application/services/CreateCodeForCustomer.js";
import { PasswordHash } from "../../domain/utils/PasswordHash.js";
import { CustomerAlreadyExistsError } from "../../domain/erros/CustomerAlreadyExistsError.js";

const createCodeForCustomerBodySchema = z.object({
    email:  z.string({ message: "Informe um email válido"}).email(),
    password: z.string()
})

export class CreateCodeForCustomerController {

   async create(req: Request, res: Response) {
       
       const customerMapper = new CustomerMapper()
       const passwordHash = new PasswordHash()
       const customerPrismaRepository = new CustomerPrismaRepository(customerMapper)
       const createCodeForCustomerService = new CreateCodeForCustomerService(customerPrismaRepository, passwordHash)
       
       try {
        const { email, password  } = createCodeForCustomerBodySchema.parse(req.body)
        
        const { customerCode } = await createCodeForCustomerService.execute({
           email,
           password
        })

        return res.status(201).json({
            "customer_code": customerCode
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
        
        if(e instanceof CustomerAlreadyExistsError) {
            res.status(404).json({
                description: "Usuário Não pode ser cadastrado",
                "error_code": "CUSTOMER_EXISTS",
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