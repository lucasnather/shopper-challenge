import { Prisma } from "@prisma/client";
import { GeminiFactory } from "../../application/gateway/GeminiFactory.js";
import { Consumption } from "../../domain/Consumption.js";

export class GeminiPrismaRepository implements GeminiFactory {

    async create(data: Prisma.ComsumptionsCreateInput): Promise<Consumption> {
        throw new Error("Method not implemented.");
    }
    
    async findByMonth(measureDatetime: Date): Promise<Consumption | null> {
        throw new Error("Method not implemented.");
    }

}