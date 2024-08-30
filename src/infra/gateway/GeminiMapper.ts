import { Prisma } from "@prisma/client";
import { Measures } from "../../domain/Measures.js";
import { randomUUID } from "node:crypto";

export class GeminiMapper {

    public toDomain(data: Prisma.MeasuresCreateInput) {
        const id = data.measureId || randomUUID()
        const date = new Date(data.measureDatetime)

        return new Measures(
            id, 
            data.measureValue, 
            date, 
            data.measureType, 
            data.customerCode, 
            data.imageUrl, 
            data.hasConfirmed || false)
    }

    public toEntity(data: Measures) {
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