import { z, ZodError } from "zod";
import type { Request, Response } from 'express'
import { CustomerMapper } from "../gateway/CustomerMapper.js";
import { CustomerPrismaRepository } from "../repository/CustomerPrismaRepository.js";
import { PasswordHash } from "../../domain/utils/PasswordHash.js";
import { GetCodeCustomerService } from "../../application/services/GetCustomerCodeService.js";
import { InvalidCredentialsError } from "../../domain/erros/InvalidCredentialsError.js";

const getCustomerCodeBodySchema = z.object({
    email:  z.string({ message: "Informe um email válido"}),
    password: z.string()
})

export class GetCustomerCodeController {

   async get(req: Request, res: Response) {
       
       const customerMapper = new CustomerMapper()
       const passwordHash = new PasswordHash()
       const customerPrismaRepository = new CustomerPrismaRepository(customerMapper)
       const getCodeCustomerService = new GetCodeCustomerService(customerPrismaRepository, passwordHash)
       
       try {
        const { email, password  } = getCustomerCodeBodySchema.parse(req.body)
        
        const { customerCode } = await getCodeCustomerService.execute({
           email,
           password
        })

        console.log(customerCode)

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
        
        if(e instanceof InvalidCredentialsError) {
            res.status(404).json({
                description: "Credenciais Inválidas",
                "error_code": "INVALID_CREDENTIALS",
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