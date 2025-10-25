import Router from 'express'
import { recordService, listServices } from '../Controller/serviceController.js'


const router = Router()

router.post('/recordService', recordService)
router.get('/getServices', listServices)

export default router
