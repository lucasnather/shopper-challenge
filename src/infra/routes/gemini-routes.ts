import { Router } from 'express'
import { CreateMeasureController } from '../controller/CreateMeasureController.js'
import { ConfirmMeasureValueController } from '../controller/ConfirmMeasureValueController.js'
import { FindManyMeasureValueController } from '../controller/FindManyMeasureController.js'

const router = Router()

const createGeminiController = new CreateMeasureController()
const confirmMeasuresValueController = new ConfirmMeasureValueController()
const findManyMeasuresValueController = new FindManyMeasureValueController()

router 
    .post('/upload', (req, res) => createGeminiController.upload(req, res))
    .patch('/confirm', (req, res) => confirmMeasuresValueController.confirm(req, res))
    .get('/:customer_code/list', (req, res) => findManyMeasuresValueController.getMany(req, res))
    
export const geminRouter = router