import express from 'express'
import {addProduct,getAllProducts} from '../controllers/productController.js'
import {auth,isAdmin} from '../middlewares/auth.js'

const router = express.Router()

router.get('/all',getAllProducts)

export default router