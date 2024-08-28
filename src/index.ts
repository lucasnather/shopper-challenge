import express from 'express'
import { geminRouter } from './infra/routes/gemini-routes.js'

const app = express()

app.use(express.json({
    limit: '100mb'
}))

const port = process.env.PORT || 8080

app.get('/', async (req, res) => {
    res.json({
        message: "Hello World"
    })
})

app.use(geminRouter)


app.listen(port, () => {
    console.log(`Application running at port http://localhost:${port}/`)
})