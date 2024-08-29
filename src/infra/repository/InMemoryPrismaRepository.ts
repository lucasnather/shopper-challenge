import { Comsumptions, Prisma } from "@prisma/client";
import { ConsumptionsResponse, GeminiFactory } from "../../application/gateway/GeminiFactory.js";
import { MeasureType } from "../../domain/enum/MeasureType.js";
import { randomUUID } from "node:crypto";
import { GeminiMapper } from "../gateway/GeminiMapper.js";
import { Consumption } from "../../domain/Consumption.js";

export class InMemoryPrismaRepository implements GeminiFactory {

    private consumptions: Consumption[] = []

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

    async confirmValue(measureValue: number, measureId?: string): Promise<Consumption | null> {
        let consumption = this.consumptions.find(consumption => {
            return consumption.getMeasureValue === measureValue && measureId
        })

        if(!consumption) return null

        consumption.setHasConfirmed(true)
    
        return consumption
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
    
    async findById(measureId: string): Promise<Consumption | null> {
        const consumption = this.consumptions.find(consumption => consumption.getMeasureId === measureId)
    
        if(!consumption) return null

        return consumption
    }

    async findMany(customerCode: string, measureType?: MeasureType): Promise<ConsumptionsResponse> {
        let consumption

        if(measureType) {
            consumption = this.consumptions.filter(consumption => {
                return consumption.getCustomerCode === customerCode && consumption.getMeasureType === measureType
            })
        } else {
            consumption = this.consumptions.filter(consumption => {
                return consumption.getCustomerCode === customerCode
            })

        }

        const measures = consumption.map(consumption => {
            return {
                hasConfirmed: consumption.getHasConfirmed,
                imageUrl: consumption.getImageUrl,
                measureDatetime: consumption.getMeasureDatetime,
                measureId: consumption.getMeasureId,
                measureType: consumption.getMeasureType,
                measureValue: consumption.getMeasureValue
            }
        })

        return {
            customerCode,
            measures
        }
    }


}