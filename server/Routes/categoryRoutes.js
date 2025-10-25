import { Router } from "express";
import { getCategories, addCategory, deleteCategory, updateCategory } from "../Controller/categoryController.js";

const router = Router()

router.get('/', getCategories)
router.post('/addCategory', addCategory)
router.post('/deleteCategory/:id', deleteCategory)
router.post('/updateCategory/:id', updateCategory)

export default router