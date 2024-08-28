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

        if(!findConsumptionById) throw new Error('Erro a ser tratado: Consumption Not FOund')

        const isValueEqual = findConsumptionById.getMeasureValue === data.measureValue

        if(!isValueEqual) throw new Error('Erro a ser tratado: Value is not Equal')

        await this.geminiFactory.confirmValue(data.measureValue, data.measureId)

        return {
            success: true
        }
    }
}
