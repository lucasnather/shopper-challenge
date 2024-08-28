import { Router } from 'express'
import { CreateConsumptionController } from '../controller/CreateConsumptionController.js'
import { ConfirmConsumptionValueController } from '../controller/ConfirmConsumptionValueController.js'
import { FindManyConsumptionValueController } from '../controller/FindManyConsumptionController.js'

const router = Router()

const createGeminiController = new CreateConsumptionController()
const confirmConsumptionValueController = new ConfirmConsumptionValueController()
const findManyConsumptionValueController = new FindManyConsumptionValueController()

router 
    .post('/upload', (req, res) => createGeminiController.upload(req, res))
    .patch('/confirm', (req, res) => confirmConsumptionValueController.confirm(req, res))
    .get('/:customer_code/list', (req, res) => findManyConsumptionValueController.getMany(req, res))
    
export const geminRouter = router