import { InMemoryCustomerRepository } from "../../infra/repository/InMemoryCustomerRepository.js"
import { CreateCodeForCustomerService } from "./CreateCodeForCustomer.js"
import { PasswordHash } from "../../domain/utils/PasswordHash.js"
import { CustomerAlreadyExistsError } from "../../domain/erros/CustomerAlreadyExistsError.js"

let inMemoryCustomerRepository: InMemoryCustomerRepository
let passwordHash: PasswordHash
let sut: CreateCodeForCustomerService

describe('Create Code For Service', () => {

    beforeEach(() => {
        inMemoryCustomerRepository = new InMemoryCustomerRepository()
        passwordHash = new PasswordHash()
        sut = new CreateCodeForCustomerService(inMemoryCustomerRepository, passwordHash)
    })

    it('Should be register a code for a customer', async () => {

        const { customerCode } = await sut.execute({
            email: 'email@email.com',
            password: '123456',
        })

        expect(customerCode).toBeTypeOf("string")
    })

    it('Should not register with email already exists', async () => {
        await sut.execute({
            email: 'email@email.com',
            password: '123456',
        })

        expect(async () => {
            await sut.execute({
                email: 'email@email.com',
                password: '123456',
            })
        }).rejects.toBeInstanceOf(CustomerAlreadyExistsError)

    })

})
