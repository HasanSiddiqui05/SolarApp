import Router from 'express'
import { searchAll , recordSale, listSales, undoSale, reportData, salesOverTime} from '../Controller/salesController.js'

const router = Router()

router.get('/search', searchAll)
router.post('/recordSale', recordSale)
router.get('/getSales', listSales)
router.post("/undoSale/:saleId", undoSale);
router.get('/reportData', reportData)
router.get('/reportData2', salesOverTime)

export default router

