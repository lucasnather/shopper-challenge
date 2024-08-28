import { MeasureType } from "@prisma/client"
import { randomUUID } from "node:crypto"

export class Consumption {

    private measureId: string
    private measureValue: number
    private measureDatetime: Date
    private measureType: MeasureType
    private customerCode: string
    private imageUrl: string
    private hasConfirmed: boolean

    constructor(
        measureId: string,
        measureValue: number,
        measureDatetime: Date,
        measureType: MeasureType,
        customerCode: string,
        imageUrl: string,
        hasConfirmed: boolean
    ) {
        this.measureId = measureId || randomUUID()
        this.measureValue = measureValue
        this.measureDatetime = measureDatetime
        this.measureType = measureType
        this.customerCode = customerCode
        this.imageUrl = imageUrl
        this.hasConfirmed = hasConfirmed || false
    }

    public get getMeasureId() {
        return this.measureId
    }

    public get getMeasureValue() {
        return this.measureValue
    }
    public get getMeasureDatetime() {
        return this.measureDatetime
    }

    public get getMeasureType() {
        return this.measureType
    }
    public get getCustomerCode() {
        return this.customerCode
    }

    public get getImageUrl() {
        return this.imageUrl
    }

    public get getHasConfirmed() {
        return this.hasConfirmed
    }
}