import express from 'express'
import { getAllProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.js'

const router = express.Router()

router.get('/', getAllProduct)
router.post('/', createProduct)
router.put('/:productId', updateProduct)
router.delete('/:productId', deleteProduct)


export default router