import express, {Request, Response} from 'express'
import { z } from 'zod'
import { GeminiImageAnalyze } from './domain/gemini/GeminiImageAnalyze.js';
import { Converter } from './domain/utils/Converter.js';

const app = express()

app.use(express.json())

const port = process.env.PORT || 8080

app.get('/', async (req, res) => {
    res.json({
        message: "Hello World"
    })
})

const bodySchema = z.object({
    image: z.string()
})

app.post('/upload', async (req: Request, res: Response) => {
   const { image } = bodySchema.parse(req.body)

   const converter = new Converter()
   converter.convertToPNG(image)

    const gemini = new GeminiImageAnalyze()
    const geminiResponse = await gemini.response('./image.png')
    console.log(geminiResponse)

   res.send({})
})

app.listen(port, () => {
    console.log(`Application running at port http://localhost:${port}/`)
})