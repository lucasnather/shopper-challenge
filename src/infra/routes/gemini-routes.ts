import { Router } from 'express'
import { CreateConsumptionController } from '../controller/CreateConsumptionController.js'
import { ConfirmConsumptionValueController } from '../controller/ConfirmConsumptionValueController.js'

const router = Router()

const createGeminiController = new CreateConsumptionController()
const confirmConsumptionValueController = new ConfirmConsumptionValueController()

router 
    .post('/upload', (req, res) => createGeminiController.upload(req, res))
    .patch('/confirm', (req, res) => confirmConsumptionValueController.confirm(req, res))
    
export const geminRouter = router