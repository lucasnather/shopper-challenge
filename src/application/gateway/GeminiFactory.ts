import { Prisma } from "@prisma/client";
import { Consumption } from "../../domain/Consumption.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

export type Measures = {
    measureId: string,
    measureDatetime: Date,
    measureType: string,
    hasConfirmed:boolean | null,
    imageUrl: string
}

export type ConsumptionsResponse = {
    customerCode: string,
    measures: Measures[]
}

export interface GeminiFactory {
    create(data: Prisma.ComsumptionsCreateInput): Promise<Consumption>
    confirmValue(measureValue: number, measureId: string): Promise<Consumption>
    findByMonth(measureType: MeasureType, measureDatetime: Date): Promise<string | null>
    findById(measureId: string): Promise<Consumption | null>
    findMany(customerCode: string, measureType?: MeasureType): Promise<ConsumptionsResponse>
}