import express from 'express'

const app = express()

app.use(express.json())

const port = process.env.PORT || 8080

app.get('/', async (req, res) => {
    res.json({
        message: "Hello World"
    })
})


app.listen(port, () => {
    console.log(`Application running at port http://localhost:${port}/`)
})