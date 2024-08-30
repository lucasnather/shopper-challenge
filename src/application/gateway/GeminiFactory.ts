import { Prisma } from "@prisma/client";
import { Measures } from "../../domain/Measures.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

export type Measure = {
    measureId: string,
    measureDatetime: Date,
    measureType: string,
    hasConfirmed:boolean | null,
    imageUrl: string
}

export type MeasuresResponse = {
    customerCode: string,
    measures: Measure[]
}

export interface GeminiFactory {
    create(data: Prisma.MeasuresCreateInput): Promise<Measures>
    confirmValue(measureValue: number, measureId?: string): Promise<Measures | null>
    findByMonth(measureType: MeasureType, measureDatetime: Date): Promise<string | null>
    findById(measureId: string): Promise<Measures | null>
    findMany(customerCode: string, measureType?: MeasureType): Promise<MeasuresResponse>
}