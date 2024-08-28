import { MeasureAlreadyConfirmedError } from "../../domain/erros/MeasureAlreadyConfirmedError.js";
import { MeasureNotFoundError } from "../../domain/erros/MeasureNotFoundError.js";
import { ValueNotEqualError } from "../../domain/erros/ValueNotEqualError.js";
import { GeminiFactory } from "../gateway/GeminiFactory.js";

type ConfirmConsumptionValueRequest = {
    measureValue: number
    measureId: string
}

type ConfirmConsumptionValueResponse = {
    success: boolean
}

export class ConfirmConsumptionValueService {

    constructor(
        private geminiFactory: GeminiFactory,
    ) {}

    async execute(data: ConfirmConsumptionValueRequest): Promise<ConfirmConsumptionValueResponse> {
       
        const findConsumptionById = await this.geminiFactory.findById(data.measureId)

        if(!findConsumptionById) throw new MeasureNotFoundError()

        if(findConsumptionById.getHasConfirmed) throw new MeasureAlreadyConfirmedError()

        const isValueEqual = findConsumptionById.getMeasureValue === data.measureValue

        if(!isValueEqual) throw new ValueNotEqualError()

        await this.geminiFactory.confirmValue(data.measureValue, data.measureId)

        return {
            success: true
        }
    }
}
