import { MeasureAlreadyConfirmedError } from "../../domain/erros/MeasureAlreadyConfirmedError.js";
import { MeasureNotFoundError } from "../../domain/erros/MeasureNotFoundError.js";
import { GeminiFactory } from "../gateway/GeminiFactory.js";

type ConfirmMeasureValueRequest = {
    measureValue: number
    measureId: string
}

type ConfirmMeasureValueResponse = {
    success: boolean
}

export class ConfirmMeasureValueService {

    constructor(
        private geminiFactory: GeminiFactory,
    ) {}

    async execute(data: ConfirmMeasureValueRequest): Promise<ConfirmMeasureValueResponse> {
       
        const findMeasureById = await this.geminiFactory.findById(data.measureId)

        if(!findMeasureById) throw new MeasureNotFoundError()

        if(findMeasureById.getHasConfirmed) throw new MeasureAlreadyConfirmedError()

        await this.geminiFactory.confirmValue(data.measureValue, data.measureId)

        return {
            success: true
        }
    }
}
