import { imageBase64 } from "../../../test/image-base64.js"
import { CreateMeasureService } from "./CreateMeasureService.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js"
import { Converter } from "../../domain/utils/Converter.js"
import { InvalidReadbleMonthError } from "../../domain/erros/InvalidReadbleMonthError.js"
import { InMemoryPrismaRepository } from "../../infra/repository/InMemoryPrismaRepository.js"
import { InMemoryCustomerRepository } from "../../infra/repository/InMemoryCustomerRepository.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let geminiImageAnalyse: GeminiImageAnalyze
let converter: Converter
let sut: CreateMeasureService

describe('Create Measure Service', () => {

    beforeEach(() => {
        geminiImageAnalyse = new GeminiImageAnalyze()
        converter = new Converter()
        inMemoryPrismaRepository = new InMemoryPrismaRepository()
        inMemoryCustomerRepository = new InMemoryCustomerRepository()
        sut = new CreateMeasureService(inMemoryPrismaRepository, inMemoryCustomerRepository, geminiImageAnalyse, converter)
    })

    it('Should be register a measure', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        const { imageUrl, measureUUID, measureValue } = await sut.execute({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            image: imageBase64
        })

        expect(measureUUID).toBeTypeOf("string")
        expect(measureValue).toBeTypeOf("number")
    })

    it('Should not be register a measure with same date', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await sut.execute({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            image: imageBase64
        })

        expect(async () => {
            await sut.execute({
                customerCode: customer.getCustomerCode,
                measureDatetime: new Date(),
                measureType: MeasureType.WATER,
                image: imageBase64
            })
        }).rejects.toBeInstanceOf(InvalidReadbleMonthError)

    })
    it('Should not be register a measure in same month', async () => {
        const customer = await inMemoryCustomerRepository.create({
            email: 'email@email.com',
            password: '123456',
        })

        await sut.execute({
            customerCode: customer.getCustomerCode,
            measureDatetime: new Date(2024, 4, 30),
            measureType: MeasureType.WATER,
            image: imageBase64
        })

        expect(async () => {
            await sut.execute({
                customerCode: customer.getCustomerCode,
                measureDatetime: new Date(2024, 4, 15),
                measureType: MeasureType.WATER,
                image: imageBase64
            })
        }).rejects.toBeInstanceOf(InvalidReadbleMonthError)
    })
})
