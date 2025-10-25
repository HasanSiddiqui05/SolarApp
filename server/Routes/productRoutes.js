import { Router } from "express";
import {getProducts, addProduct, deleteProduct, updateProduct} from '../Controller/productController.js'

const router = Router()

router.get('/:name', getProducts)
router.post('/addProduct', addProduct)
router.post('/deleteProduct/:id', deleteProduct)
router.post('/updateProduct/:id', updateProduct)

export default router