import { randomUUID } from "node:crypto"

export class Customer {

    private id: string
    private email: string
    private password: string
    private customerCode: string

    constructor(
        id: string,
        email: string,
        password: string,
        customerCode: string
    ) {
        this.id = id || randomUUID()
        this.email = email
        this.password = password
        this.customerCode = customerCode
    }

    public get getId() {
        return this.id
    }

    public get getEmail() {
        return this.email
    }

    public get getPassoword() {
        return this.password
    }

    public get getCustomerCode() {
        return this.customerCode
    }
}