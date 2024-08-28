import { Router } from 'express'
import { CreateConsumptionController } from '../controller/CreateConsumptionController.js'

const router = Router()

const createGeminiController = new CreateConsumptionController()

router 
    .post('/upload', (req, res) => createGeminiController.post(req, res))
    
export const geminRouter = router