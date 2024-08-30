import { Prisma } from "@prisma/client";
import { Customer } from "../../domain/Customer.js";

export interface CustomerFactory {
    create(data: Prisma.CustomerCreateInput): Promise<Customer>
    findByEmail(email: string): Promise<Customer | null>
    findByCode(code: string): Promise<Customer | null>
    getCode(email: string, password: string): Promise<Customer | null>
}