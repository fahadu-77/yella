import express from 'express'
import {updateUserRole, getDashboardStats, toggleStock, allOrders, allUsers} from '../controllers/adminController.js'
import {addProduct} from '../controllers/productController.js'
import {auth,isAdmin} from '../middlewares/auth.js'


const router = express.Router()

router.get('/users',auth,isAdmin,allUsers)
router.get('/orders',auth,isAdmin,allOrders)
router.patch('/products/:id/toggle-stock',auth,isAdmin,toggleStock)
router.get('/stats', auth, isAdmin, getDashboardStats);
router.patch('/users/:userId/role', auth, isAdmin, updateUserRole);
router.post('/add-product',auth,isAdmin, addProduct)

export default router