import { MeasureType } from "../../domain/enum/MeasureType.js";
import { GeminiFactory, Measures } from "../gateway/GeminiFactory.js";

type FindManyConsumptionsValueRequest = {
    customerCode: string, 
    measureType?: MeasureType
}


type FindManyConsumptionsValueResponse = {
    customerCode: string, 
    measures: Measures[]
}

export class FindManyConsumptionsValueService {

    constructor(
        private geminiFactory: GeminiFactory,
    ) {}

    async execute(data: FindManyConsumptionsValueRequest): Promise<FindManyConsumptionsValueResponse> {
       const consumptions = await this.geminiFactory.findMany(data.customerCode, data.measureType)

       return consumptions
    }
}
