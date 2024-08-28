import { Prisma } from "@prisma/client";
import { Consumption } from "../../domain/Consumption.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

export interface GeminiFactory {
    create(data: Prisma.ComsumptionsCreateInput): Promise<Consumption>
    findByMonth(measureType: MeasureType, measureDatetime: Date): Promise<Consumption | null>
}