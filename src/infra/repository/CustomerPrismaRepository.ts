import { Prisma } from "@prisma/client";
import { CustomerFactory } from "../../application/gateway/CustomerFactory.js";
import { Customer } from "../../domain/Customer.js";
import { CustomerMapper } from "../gateway/CustomerMapper.js";
import { prisma } from "../../config/prisma.js";

export class CustomerPrismaRepository implements CustomerFactory {

    constructor(private customerMapper: CustomerMapper) {}
    
    async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
        const customer = await prisma.customer.create({
            data: {
                email: data.email,
                password: data.password,
                customerCode: data.customerCode
            }
        })

        return this.customerMapper.toDomain(customer)
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const customer = await prisma.customer.findUnique({
            where: {
                email
            }
        })

        if(!customer) return null

        return this.customerMapper.toDomain(customer)
    }

    async findByCode(code: string): Promise<Customer | null> {
        const customer = await prisma.customer.findFirst({
            where: {
                customerCode: code
            }
        })

        if(!customer) return null

        return this.customerMapper.toDomain(customer)
    }

    async getCode(email: string, password: string): Promise<Customer | null> {
        const customer = await prisma.customer.findFirst({
            where: {
                AND: [
                    {
                        email
                    },
                    {
                        password
                    }
                ]
            }
        });

        if(!customer) return null

        return this.customerMapper.toDomain(customer)
    }


}