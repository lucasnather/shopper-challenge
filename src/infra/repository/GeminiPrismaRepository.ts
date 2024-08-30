import { Prisma } from "@prisma/client";
import { MeasuresResponse, GeminiFactory } from "../../application/gateway/GeminiFactory.js";
import { Measures } from "../../domain/Measures.js";
import { prisma } from "../../config/prisma.js";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";

export class GeminiPrismaRepository implements GeminiFactory {

    constructor(private geminiMapper: GeminiMapper) {}
   
    async create(data: Prisma.MeasuresCreateInput): Promise<Measures> {
        const measure = await prisma.measures.create({
            data: {
                customerCode: data.customerCode,
                measureValue: data.measureValue,
                measureDatetime: data.measureDatetime,
                measureType: data.measureType,
                imageUrl: data.imageUrl
            }
        })

        const measureToDomain = this.geminiMapper.toDomain(measure);

        return measureToDomain
        
    }

    async  confirmValue(measureValue: number, measureId: string): Promise<Measures | null> {
        const measure = await prisma.measures.update({
            where: {
                measureValue,
                measureId
            },
            data: {
                hasConfirmed: true
            }
        })

        if(!measure) return null

        const measureToDomain = this.geminiMapper.toDomain(measure)

        return measureToDomain
    }

    async findByMonth(measureType: MeasureType, measureDatetime: Date): Promise<string | null> {
        const month = measureDatetime.getMonth() + 1

        const measure = await prisma.measures.findFirst({
            where: {
                AND: [
                    {
                        measureType
                    },
                    {
                        measureDatetime: {
                            gte: new Date(2024, month - 1, 1)
                        }
                    },
                    {
                        measureDatetime: {
                            lte: new Date(2024, month - 1, 30)
                        }
                    }
                ]
            }
        })

        if(!measure) {
            return 'Measure Not Found'
        } else {
            
            const measureMonth = measure.measureDatetime.getMonth() + 1

            if(month === measureMonth) return null

            return 'Measure Found'
        }
    }

    async findById(measureId: string): Promise<Measures | null> {
        const measure = await prisma.measures.findUnique({
            where: {
                measureId
            }
        })

        if(!measure) return null

        const measureToDomain = this.geminiMapper.toDomain(measure)

        return measureToDomain
    }

    async findMany(customerCode: string, measureType?: MeasureType): Promise<MeasuresResponse> {
        const findMeasures = await prisma.measures.findMany({
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

        const measures = findMeasures.map(measure => {
            return {
                hasConfirmed: measure.hasConfirmed,
                imageUrl: measure.imageUrl,
                measureDatetime: measure.measureDatetime,
                measureId: measure.measureId,
                measureType: measure.measureType,
                measureValue: measure.measureValue
            }
        })

        return {
            customerCode,
            measures
        }
    }

}