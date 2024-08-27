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
            "Tell me about this image.",
            {
              fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
              },
            },
          ]);

          console.log(result.response.text());

          return {
            imageName: uploadResult.file.displayName,
            url: uploadResult.file.uri
        }
    }

    private geminiModel() {
        const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY)
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" })

        return model
    }
}