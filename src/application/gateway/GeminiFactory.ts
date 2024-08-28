import { Prisma } from "@prisma/client";
import { Consumption } from "../../domain/Consumption.js";

export interface GeminiFactory {
    create(data: Prisma.ComsumptionsCreateInput): Promise<Consumption>
    findByMonth(measureDatetime: Date): Promise<Consumption | null>
}