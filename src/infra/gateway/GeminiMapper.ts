import { Prisma } from "@prisma/client";
import { Consumption } from "../../domain/Consumption.js";
import { randomUUID } from "node:crypto";

export class GeminiMapper {

    public toDomain(data: Prisma.ComsumptionsCreateInput) {
        const id = data.measureId || randomUUID()
        const date = new Date(data.measureDatetime)

        return new Consumption(
            id, 
            data.measureValue, 
            date, 
            data.measureType, 
            data.customerCode, 
            data.imageUrl, 
            data.hasConfirmed || false)
    }

    public toEntity(data: Consumption) {
        return {
            measureId: data.getMeasureId,
            measureValue: data.getMeasureValue,
            measureDatetime: data.getMeasureDatetime,
            customerCode: data.getCustomerCode,
            imageUrl: data.getImageUrl,
            hasConfirmed: data.getHasConfirmed,
        }
    }

}