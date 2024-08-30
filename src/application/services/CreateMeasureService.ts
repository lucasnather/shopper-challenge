import { MeasureType } from "../../domain/enum/MeasureType.js";
import { CustomerNotFound } from "../../domain/erros/CustomerNotFound.js";
import { InvalidReadbleMonthError } from "../../domain/erros/InvalidReadbleMonthError.js";
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js";
import { Converter } from "../../domain/utils/Converter.js";
import { CustomerFactory } from "../gateway/CustomerFactory.js";
import { GeminiFactory } from "../gateway/GeminiFactory.js";

type CreateMeasureRequest = {
    measureDatetime: Date,
    measureType: MeasureType,
    customerCode: string,
    image: string,
}

type CreateMeasureResponse = {
    measureUUID: string,
    measureValue: number,
    imageUrl: string,
}

export class CreateMeasureService {

    constructor(
        private geminiFactory: GeminiFactory,
        private customerFactory: CustomerFactory,
        private geminiImageAnalyse: GeminiImageAnalyze,
        private converter: Converter
    ) {}

    async execute(data: CreateMeasureRequest): Promise<CreateMeasureResponse> {
        // base64 to png
        const customer = await this.customerFactory.findByCode(data.customerCode)

        if(!customer) throw new CustomerNotFound()

        this.converter.convertToPNG(data.image)

        const geminiResponse = await this.geminiImageAnalyse.response('./image.png')
        const geminiImageUrl = geminiResponse.url
        const geminiMeasureValue = geminiResponse.measureValue
        
        const findMeasureByMonth = await this.geminiFactory.findByMonth(data.measureType, data.measureDatetime)
        
        if(findMeasureByMonth == null) throw new InvalidReadbleMonthError()
        if(findMeasureByMonth == 'Measure Found') throw new Error('Measure Already Exist')

        const consumption = await this.geminiFactory.create({
            customerCode: data.customerCode,
            imageUrl: geminiImageUrl,
            measureType: data.measureType,
            measureDatetime: data.measureDatetime,
            measureValue: Number(geminiMeasureValue)
        })

        return {
            imageUrl: consumption.getImageUrl,
            measureUUID: consumption.getMeasureId,
            measureValue: consumption.getMeasureValue
        }
    }
}
