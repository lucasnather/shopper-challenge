import { Router } from 'express'
import { CreateCodeForCustomerController } from '../controller/CreateCodeForCustomerController.js'
import { GetCustomerCodeController } from '../controller/GetCustomerCodeController.js'

const router = Router()

const createCodeForCustomerController = new CreateCodeForCustomerController()
const getCustomerCodeController = new GetCustomerCodeController()

router 
    .post('/register/code', (req, res) => createCodeForCustomerController.create(req, res))
    .post('/code', (req, res) => getCustomerCodeController.get(req, res))
    
export const customerRouter = router