import { Comsumptions, Prisma } from "@prisma/client";
import { ConsumptionsResponse, GeminiFactory } from "../../application/gateway/GeminiFactory.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { randomUUID } from "node:crypto";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { Consumption } from "../../domain/Consumption.js";

export class InMemoryPrismaRepository implements GeminiFactory {

    private consumptions: Consumption[] = []

    constructor(
        private geminiMapper: GeminiMapper
    ) {}

    async create(data: Prisma.ComsumptionsCreateInput): Promise<Consumption> {
        const consumption = new Consumption(
        data.measureId || randomUUID(),
        data.measureValue,
        new Date(data.measureDatetime),
        data.measureType,
        data.customerCode,
        data.imageUrl,
        data.hasConfirmed || false) 

        this.consumptions.push(consumption)

        return consumption
    }

    confirmValue(measureValue: number, measureId: string): Promise<Consumption> {
        throw new Error("Method not implemented.");
    }

    async findByMonth(measureType: MeasureType, measureDatetime: Date): Promise<string | null> {
        const month = measureDatetime.getMonth() + 1

        const consumption = this.consumptions.find(consumption => {
            return consumption.getMeasureType === measureType && (consumption.getMeasureDatetime > new Date(2024, month - 1, 1) || consumption.getMeasureDatetime < new Date(2024, month - 1, 1))
        })

        if(!consumption) {
            return 'Consumption Not Found'
        } else {
            
            const consumptionMonth = consumption.getMeasureDatetime.getMonth() + 1

            if(month === consumptionMonth) return null

            return 'Consumption Found'
        }
    }
    
    findById(measureId: string): Promise<Consumption | null> {
        throw new Error("Method not implemented.");
    }
    findMany(customerCode: string, measureType?: MeasureType): Promise<ConsumptionsResponse> {
        throw new Error("Method not implemented.");
    }


}