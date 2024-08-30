import { InMemoryCustomerRepository } from "../../infra/repository/InMemoryCustomerRepository.js"
import { PasswordHash } from "../../domain/utils/PasswordHash.js"
import { GetCodeCustomerService } from "./GetCustomerCodeService.js"
import { InvalidCredentialsError } from "../../domain/erros/InvalidCredentialsError.js"

let inMemoryCustomerRepository: InMemoryCustomerRepository
let passwordHash: PasswordHash
let sut: GetCodeCustomerService

describe('Get Customer Code Service', () => {

    beforeEach(() => {
        inMemoryCustomerRepository = new InMemoryCustomerRepository()
        passwordHash = new PasswordHash()
        sut = new GetCodeCustomerService(inMemoryCustomerRepository, passwordHash)
    })

    it('Should get a code for customer', async () => {
        await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        const { customerCode } = await sut.execute({
            email: 'email@email.com',
            password: '123456',
        })

        expect(customerCode).toBeTypeOf("string")
    })

    it('Should not get a code for customer with invalid password', async () => {
        await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await sut.execute({
            email: 'email@email.com',
            password: '123456',
        })

        expect(async () => {
            await sut.execute({
                email: 'email@email.com',
                password: 'INVALID PASSWORD',
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

    it('Should not get a code for customer with invalid email', async () => {
        await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await sut.execute({
            email: 'email@email.com',
            password: '123456',
        })

        expect(async () => {
            await sut.execute({
                email: 'INVALID_EMAIL',
                password: '123456',
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

})
