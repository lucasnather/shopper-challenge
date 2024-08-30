import { CustomerFactory } from "../gateway/CustomerFactory.js";
import { PasswordHash } from "../../domain/utils/PasswordHash.js";
import { InvalidCredentialsError } from "../../domain/erros/InvalidCredentialsError.js";

type GetCodeCustomerRequest = {
    email: string
    password: string
}

type GetCodeCustomerResponse = {
   customerCode: string
}

export class GetCodeCustomerService {

    constructor(
        private customerFactory: CustomerFactory,
        private passwordHash: PasswordHash
    ) {}

    async execute(data: GetCodeCustomerRequest): Promise<GetCodeCustomerResponse> {
       
        const findCustomer = await this.customerFactory.findByEmail(data.email)

        if(!findCustomer) throw new InvalidCredentialsError()

        const comparePassword = await this.passwordHash.comparePassword(data.password, findCustomer.getPassoword)

        if(!comparePassword) throw new InvalidCredentialsError()

        const customer = await this.customerFactory.getCode(data.email, findCustomer.getPassoword)

        if(!customer) throw new Error("Algum erro inesperado")

        return {
            customerCode: customer.getCustomerCode
        }
    }
}
