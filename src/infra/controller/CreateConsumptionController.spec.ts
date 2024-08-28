import { any, number } from "zod"
import { imageBase64 } from "../../../test/image-base64.js"
import { CreateConsumptionService } from "../../application/services/CreateConsumptionService.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js"
import { Converter } from "../../domain/utils/Converter.js"
import { GeminiMapper } from "../gateway/GeminiMapper.js"
import { InMemoryPrismaRepository } from "../repository/InMemoryPrismaRepository.js"
import { InvalidReadbleMonthError } from "../../domain/erros/InvalidReadbleMonthError.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let geminiMapper: GeminiMapper
let geminiImageAnalyse: GeminiImageAnalyze
let converter: Converter
let sut: CreateConsumptionService

describe('Create Consumption Controller', () => {

    beforeEach(() => {
        geminiMapper = new GeminiMapper()
        geminiImageAnalyse = new GeminiImageAnalyze()
        converter = new Converter()
        inMemoryPrismaRepository = new InMemoryPrismaRepository(geminiMapper)
        sut = new CreateConsumptionService(inMemoryPrismaRepository, geminiImageAnalyse, converter)
    })

    it('Should be register a measure', async () => {
        const { imageUrl, measureUUID, measureValue } = await sut.execute({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            image: imageBase64
        })

        expect(measureUUID).toBeTypeOf("string")
        expect(measureValue).toBeTypeOf("number")
    })

    it('Should not be register a measure with same date', async () => {
        await sut.execute({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            image: imageBase64
        })

        expect(async () => {
            await sut.execute({
                customerCode: '123456',
                measureDatetime: new Date(),
                measureType: MeasureType.WATER,
                image: imageBase64
            })
        }).rejects.toBeInstanceOf(InvalidReadbleMonthError)

    })
    it('Should not be register a measure in same month', async () => {
        await sut.execute({
            customerCode: '123456',
            measureDatetime: new Date(2024, 4, 30),
            measureType: MeasureType.WATER,
            image: imageBase64
        })

        expect(async () => {
            await sut.execute({
                customerCode: '123456',
                measureDatetime: new Date(2024, 4, 15),
                measureType: MeasureType.WATER,
                image: imageBase64
            })
        }).rejects.toBeInstanceOf(InvalidReadbleMonthError)
    })
})
