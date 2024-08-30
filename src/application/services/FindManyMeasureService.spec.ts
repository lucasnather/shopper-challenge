import { imageBase64 } from "../../../test/image-base64.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { InMemoryPrismaRepository } from "../../infra/repository/InMemoryPrismaRepository.js"
import { FindManyMeasureValueService } from "./FindManyMeasureService.js"
import { CustomerMeasureNotFoundError } from "../../domain/erros/CustomerMeasureNotFound.js"
import { InMemoryCustomerRepository } from "../../infra/repository/InMemoryCustomerRepository.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FindManyMeasureValueService

describe('Find Many Measure Service', () => {

    beforeEach(() => {
        inMemoryPrismaRepository = new InMemoryPrismaRepository()
        inMemoryCustomerRepository = new InMemoryCustomerRepository()
        sut = new FindManyMeasureValueService(inMemoryPrismaRepository, inMemoryCustomerRepository)
    })

    it('Should be find many consumptions by customer code', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await inMemoryPrismaRepository.create({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await inMemoryPrismaRepository.create({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.GAS,
            imageUrl: imageBase64,
            measureValue: 21
        })


        const { customerCode, measures } = await sut.execute({
            customerCode: customer.getCustomerCode,
        })

        expect(measures).toHaveLength(2)
        expect(measures[0].measureType).toEqual('WATER')
    })

    it('Should be find many consumptions by customer code filtering by WATER', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await inMemoryPrismaRepository.create({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await inMemoryPrismaRepository.create({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.GAS,
            imageUrl: imageBase64,
            measureValue: 21
        })

    
        const { customerCode, measures } = await sut.execute({
            customerCode: customer.getCustomerCode,
            measureType: MeasureType.WATER
        })

        expect(measures).toHaveLength(1)
        expect(measures[0].measureType).toEqual('WATER')

    })

    it('Should be find many consumptions by customer code filtering by GAS', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await inMemoryPrismaRepository.create({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await inMemoryPrismaRepository.create({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.GAS,
            imageUrl: imageBase64,
            measureValue: 21
        })


        const { customerCode, measures } = await sut.execute({
            customerCode: customer.getCustomerCode,
            measureType: MeasureType.GAS
        })

        expect(measures).toHaveLength(1)
        expect(measures[0].measureType).toEqual('GAS')
    })

    it('Should be return an error when measures are empty', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })
      
        expect(async () => {
            await sut.execute({
                customerCode: customer.getCustomerCode,
            })
        }).rejects.toBeInstanceOf(CustomerMeasureNotFoundError)
    })
})
