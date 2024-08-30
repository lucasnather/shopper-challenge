import { imageBase64 } from "../../../test/image-base64.js"
import { MeasureType } from "../../domain/enum/MeasureType.js"
import { InMemoryPrismaRepository } from "../../infra/repository/InMemoryPrismaRepository.js"
import { ConfirmMeasureValueService } from "./ConfirmMeasureValueService.js"
import { MeasureAlreadyConfirmedError } from "../../domain/erros/MeasureAlreadyConfirmedError.js"
import { MeasureNotFoundError } from "../../domain/erros/MeasureNotFoundError.js"
import { ValueNotEqualError } from "../../domain/erros/ValueNotEqualError.js"

let inMemoryPrismaRepository: InMemoryPrismaRepository
let sut: ConfirmMeasureValueService

describe('Confirm Measure Service', () => {

    beforeEach(() => {
        inMemoryPrismaRepository = new InMemoryPrismaRepository()
        sut = new ConfirmMeasureValueService(inMemoryPrismaRepository)
    })

    it('Should be confirm a measure', async () => {
        const { getMeasureId } = await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        const { success } = await sut.execute({
            measureValue: 21,
            measureId: getMeasureId
        })

        expect(success).toEqual(true)
        expect(success).toBeTruthy()
    })

    it('Should not be confirm a measure twice', async () => {
        const { getMeasureId } = await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(2021, 7, 29),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        const { success } = await sut.execute({
            measureValue: 21,
            measureId: getMeasureId
        })

        expect(async () => {
            const { success } = await sut.execute({
                measureValue: 21,
                measureId: getMeasureId
            })
        }).rejects.toBeInstanceOf(MeasureAlreadyConfirmedError)

    })
    it('Should not be found a measure with invalid UUUID', async () => {
        const { getMeasureId } = await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

        await sut.execute({
            measureValue: 21,
            measureId: getMeasureId
        })

        expect(async () => {
            await sut.execute({
                measureValue: 21,
                measureId: 'invalid-uuid'
            })
        }).rejects.toBeInstanceOf(MeasureNotFoundError)
    })

    it('Should not be confirm a value with value diferent', async () => {
        const { getMeasureId } = await inMemoryPrismaRepository.create({
            customerCode: '123456',
            measureDatetime: new Date(),
            measureType: MeasureType.WATER,
            imageUrl: imageBase64,
            measureValue: 21
        })

    
        expect(async () => {
            await sut.execute({
                measureValue: 100,
                measureId: getMeasureId
            })
        }).rejects.toBeInstanceOf(ValueNotEqualError)
    })
})
