import { randomUUID } from "node:crypto";
import { CustomerFactory } from "../gateway/CustomerFactory.js";
import { PasswordHash } from "../../domain/utils/PasswordHash.js";
import { CustomerAlreadyExistsError } from "../../domain/erros/CustomerAlreadyExistsError.js";

type CreateCodeForCustomerRequest = {
    email: string
    password: string
}

type CreateCodeForCustomerResponse = {
   customerCode: string
}

export class CreateCodeForCustomerService {

    constructor(
        private customerFactory: CustomerFactory,
        private passwordHash: PasswordHash
    ) {}

    async execute(data: CreateCodeForCustomerRequest): Promise<CreateCodeForCustomerResponse> {
       
        const findCustomer = await this.customerFactory.findByEmail(data.email)

        if(findCustomer) throw new CustomerAlreadyExistsError()

        const hash = await this.passwordHash.hashPassword(data.password)

        const generateCustomerId = randomUUID()

        const customer = await this.customerFactory.create({
            email: data.email,
            password: hash,
            customerCode: generateCustomerId
        })

        return {
            customerCode: customer.getCustomerCode
        }
    }
}
