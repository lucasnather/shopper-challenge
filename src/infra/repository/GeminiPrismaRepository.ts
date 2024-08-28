import { Prisma } from "@prisma/client";
import { GeminiFactory } from "../../application/gateway/GeminiFactory.js";
import { Consumption } from "../../domain/Consumption.js";
import { prisma } from "../../config/prisma.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

export class GeminiPrismaRepository implements GeminiFactory {

    constructor(private geminiMapper: GeminiMapper) {}

    async create(data: Prisma.ComsumptionsCreateInput): Promise<Consumption> {
        const consumption = await prisma.comsumptions.create({
            data: {
                customerCode: data.customerCode,
                measureValue: data.measureValue,
                measureDatetime: data.measureDatetime,
                measureType: data.measureType,
                imageUrl: data.imageUrl
            }
        })

        const consumptionToDomain = this.geminiMapper.toDomain(consumption);

        return consumptionToDomain
        
    }

    async findByMonth(measureType: MeasureType, measureDatetime: Date): Promise<Consumption | null> {
        const month = measureDatetime.getMonth() + 1

        const consumption = await prisma.comsumptions.findFirst({
            where: {
                measureType,
                measureDatetime
            }
        })

        if(!consumption) return null

        const consumptionMonth = consumption.measureDatetime.getMonth() + 1

        if(month === consumptionMonth) return null

        const consumptionToDomain = this.geminiMapper.toDomain(consumption)

        return consumptionToDomain

    }

}