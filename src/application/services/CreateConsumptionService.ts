import { MeasureType } from "../../domain/enum/MeasureType.js";
import { GeminiImageAnalyze } from "../../domain/gemini/GeminiImageAnalyze.js";
import { Converter } from "../../domain/utils/Converter.js";
import { GeminiFactory } from "../gateway/GeminiFactory.js";

type CreateConsumptionRequest = {
    measureDatetime: Date,
    measureType: MeasureType,
    customerCode: string,
    image: string,
}

type CreateConsumptionResponse = {
    measureUUID: string,
    measureValue: number,
    imageUrl: string,
}

export class CreateConsumptionService {

    constructor(
        private geminiFactory: GeminiFactory,
        private geminiImageAnalyse: GeminiImageAnalyze,
        private converter: Converter
    ) {}

    async execute(data: CreateConsumptionRequest): Promise<CreateConsumptionResponse> {
        // base64 to png
        this.converter.convertToPNG(data.image)

        const geminiResponse = await this.geminiImageAnalyse.response('./image.png')
        const geminiImageUrl = geminiResponse.url
        const geminiMeasureValue = geminiResponse.measureValue
        
        console.log(geminiResponse)

        const findConsumptionByMonth = await this.geminiFactory.findByMonth(data.measureType, data.measureDatetime)
        console.log(findConsumptionByMonth)

        if(!findConsumptionByMonth) throw new Error('Erro para ser tratado: Existe leitura com este mes, Invalid data')

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
