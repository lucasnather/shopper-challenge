import { imageBase64 } from "../../../test/image-base64.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { InMemoryPrismaRepository } from "../../infra/repository/InMemoryPrismaRepository.js"
import { FindManyMeasuresValueService } from "./FindManyMeasureService.js"
import { CustomerMeasureNotFoundError } from "../../domain/erros/CustomerMeasureNotFound.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let sut: FindManyMeasuresValueService

describe('Find Manany Measure Service', () => {

    beforeEach(() => {
        inMemoryPrismaRepository = new InMemoryPrismaRepository()
        sut = new FindManyMeasuresValueService(inMemoryPrismaRepository)
    })

    it('Should be find many consumptions by customer code', async () => {
        await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.GAS,
            imageUrl: imageBase64,
            measureValue: 21
        })


        const { customerCode, measures } = await sut.execute({
            customerCode: '123456',
        })

        expect(customerCode).toEqual('123456')
        expect(measures).toHaveLength(2)
        expect(measures[0].measureType).toEqual('WATER')
    })

    it('Should be find many consumptions by customer code filtering by WATER', async () => {
        await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.GAS,
            imageUrl: imageBase64,
            measureValue: 21
        })

    
        const { customerCode, measures } = await sut.execute({
            customerCode: '123456',
            measureType: MeasureType.WATER
        })

        expect(customerCode).toEqual('123456')
        expect(measures).toHaveLength(1)
        expect(measures[0].measureType).toEqual('WATER')

    })

    it('Should be find many consumptions by customer code filtering by GAS', async () => {
        await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.GAS,
            imageUrl: imageBase64,
            measureValue: 21
        })


        const { customerCode, measures } = await sut.execute({
            customerCode: '123456',
            measureType: MeasureType.GAS
        })

        expect(customerCode).toEqual('123456')
        expect(measures).toHaveLength(1)
        expect(measures[0].measureType).toEqual('GAS')
    })

    it('Should be return an error when measures are empty', async () => {
      
        expect(async () => {
            await sut.execute({
                customerCode: '123456',
            })
        }).rejects.toBeInstanceOf(CustomerMeasureNotFoundError)
    })
})
