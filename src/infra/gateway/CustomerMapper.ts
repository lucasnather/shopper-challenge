import { Prisma } from "@prisma/client";
import { Measures } from "../../domain/Measures.js";
import { randomUUID } from "node:crypto";
import { Customer } from "../../domain/Customer.js";

export class CustomerMapper {

    public toDomain(data: Prisma.CustomerCreateInput) {
        const id = data.id || randomUUID()
        const generateCode = randomUUID()

        return new Customer(
            id,
            data.email,
            data.password,
            data.customerCode || generateCode ,
        )
    }

    public toEntity(data: Customer) {
        return {
            id: data.getId,
            email: data.getEmail,
            passoword: data.getPassoword,
            customerCode: data.getCustomerCode,
        }
    }

}