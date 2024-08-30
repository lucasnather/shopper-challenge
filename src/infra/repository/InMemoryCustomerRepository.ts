import { Prisma } from "@prisma/client";
import { CustomerFactory } from "../../application/gateway/CustomerFactory.js";
import { Customer } from "../../domain/Customer.js";
import { randomUUID } from "node:crypto";
import { hash } from "bcrypt";

export class InMemoryCustomerRepository implements CustomerFactory {

    private customers: Customer[] = []

    async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
        const id = data.id || randomUUID()
        const generateCode = randomUUID()
        const hashPassword = await hash(data.password, 8)

        const customer = new Customer(
            id,
            data.email,
            hashPassword,
            data.customerCode || generateCode
          ) 
    
        this.customers.push(customer)
    
        return customer
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const customer = this.customers.find(customer => customer.getEmail === email)
    
        if(!customer) return null

        return customer
    }

    async findByCode(code: string): Promise<Customer | null> {
        const customer = this.customers.find(customer => customer.getCustomerCode === code)
    
        if(!customer) return null

        return customer
    }

    async getCode(email: string, password: string): Promise<Customer | null> {
       const customer = this.customers.find(customer => {
        return customer.getEmail === email && customer.getPassoword === password
       })
    
        if(!customer) return null

        return customer
    }

}