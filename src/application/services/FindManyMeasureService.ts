import { MeasureType } from "../../domain/enum/MeasureType.js";
import { CustomerMeasureNotFoundError } from "../../domain/erros/CustomerMeasureNotFound.js";
import { CustomerNotFound } from "../../domain/erros/CustomerNotFound.js";
import { CustomerFactory } from "../gateway/CustomerFactory.js";
import { GeminiFactory, Measure } from "../gateway/GeminiFactory.js";

type FindManyMeasureValueRequest = {
    customerCode: string, 
    measureType?: MeasureType
}


type FindManyMeasureValueResponse = {
    customerCode: string, 
    measures: Measure[]
}

export class FindManyMeasureValueService {

    constructor(
        private geminiFactory: GeminiFactory,
        private customerFactoty: CustomerFactory
    ) {}

    async execute(data: FindManyMeasureValueRequest): Promise<FindManyMeasureValueResponse> {
        const findCostumer = await this.customerFactoty.findByCode(data.customerCode)

        if(!findCostumer) throw new CustomerNotFound()

       const consumptions = await this.geminiFactory.findMany(data.customerCode, data.measureType)

       if(consumptions.measures.length === 0) throw new CustomerMeasureNotFoundError()

       return consumptions
    }
}
