import { imageBase64 } from "../../../test/image-base64.js"
import { CreateMeasureService } from "./CreateMeasureService.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js"
import { Converter } from "../../domain/utils/Converter.js"
import { InvalidReadbleMonthError } from "../../domain/erros/InvalidReadbleMonthError.js"
import { InMemoryPrismaRepository } from "../../infra/repository/InMemoryPrismaRepository.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let geminiImageAnalyse: GeminiImageAnalyze
let converter: Converter
let sut: CreateMeasureService

describe('Create Measure Service', () => {

    beforeEach(() => {
        geminiImageAnalyse = new GeminiImageAnalyze()
        converter = new Converter()
        inMemoryPrismaRepository = new InMemoryPrismaRepository()
        sut = new CreateMeasureService(inMemoryPrismaRepository, geminiImageAnalyse, converter)
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
