import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../env.js";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export class GeminiImageAnalyze {

    public async response(path: string) {
        const model = this.geminiModel()
        const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY)

        const uploadResult = await fileManager.uploadFile(
            path,
            {
                mimeType: 'image/png',
                displayName: 'Análise Medidor'
            }
        )

        const result = await model.generateContent([
            "Você é um chatbot que analisa medidores de água ou gás, você vai analisar uma\n imagem que será passada e retornar APENAS O VALOR INTEIRO do consumo, \nnão envie textos no formato string, me data, nem objeto, APENAS O VALOR INTEIRO DO CONSUMO DE ÀGUA OU GÀS. Caso alguém envie outro tipo de foto\n que não seja de sobre medidores de água  gás, responda que você é um \nchatbot apenas de medidores",
            {
              fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
              },
            },
          ]);

          const resultText = result.response.text()

          return {
            imageName: uploadResult.file.displayName,
            url: uploadResult.file.uri,
            measureValue: resultText
        }
    }

    private geminiModel() {
        const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY)
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" })

        return model
    }
}