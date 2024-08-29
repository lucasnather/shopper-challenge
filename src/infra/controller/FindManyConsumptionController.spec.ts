import { imageBase64 } from "../../../test/image-base64.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { GeminiMapper } from "../gateway/GeminiMapper.js"
import { InMemoryPrismaRepository } from "../repository/InMemoryPrismaRepository.js"
import { FindManyConsumptionsValueService } from "../../application/services/FindManyConsumptions.js"
import { CustomerMeasureNotFoundError } from "../../domain/erros/CustomerMeasureNotFound.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let geminiMapper: GeminiMapper
let sut: FindManyConsumptionsValueService

describe('Find Manany Consumption Service', () => {

    beforeEach(() => {
        geminiMapper = new GeminiMapper()
        inMemoryPrismaRepository = new InMemoryPrismaRepository(geminiMapper)
        sut = new FindManyConsumptionsValueService(inMemoryPrismaRepository)
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

        console.log(customerCode)
        console.log(measures)

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
