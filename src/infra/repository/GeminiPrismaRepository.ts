import { Prisma } from "@prisma/client";
import { ConsumptionsResponse, GeminiFactory } from "../../application/gateway/GeminiFactory.js";
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

    async  confirmValue(measureValue: number, measureId: string): Promise<Consumption> {
        const consumption = await prisma.comsumptions.update({
            where: {
                measureId,
                measureValue
            },
            data: {
                hasConfirmed: true
            }
        })

        const consumptionToDomain = this.geminiMapper.toDomain(consumption)

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

    async findById(measureId: string): Promise<Consumption | null> {
        const consumption = await prisma.comsumptions.findUnique({
            where: {
                measureId
            }
        })

        if(!consumption) return null

        const consumptionToDomain = this.geminiMapper.toDomain(consumption)

        return consumptionToDomain
    }

    async findMany(customerCode: string, measureType?: MeasureType): Promise<ConsumptionsResponse> {
        const consumptions = await prisma.comsumptions.findMany({
            where: {
                customerCode,
                measureType
            },
            select: {
                hasConfirmed: true,
                imageUrl: true,
                measureDatetime: true,
                measureId: true,
                measureType: true,
                measureValue: true
            }
        })

        const measures = consumptions.map(consumption => {
            return {
                hasConfirmed: consumption.hasConfirmed,
                imageUrl: consumption.imageUrl,
                measureDatetime: consumption.measureDatetime,
                measureId: consumption.measureId,
                measureType: consumption.measureType,
                measureValue: consumption.measureValue
            }
        })

        return {
            customerCode,
            measures
        }
    }

}