import express from 'express'
const router = express.Router()
import {getMyTask, getStaffDashboard} from '../controllers/dashboardController.js'
import {getMyOrders, createOrder, updateToPacking, updateToReadyAndAssign, completeOrder} from '../controllers/orderController.js'
import {auth,isStaff} from '../middlewares/auth.js'

router.post('/create',auth,createOrder)
router.get('/my-orders',auth,getMyOrders)

router.put('/:id/packing',auth,isStaff,updateToPacking)
router.put('/:id/ready',auth,isStaff,updateToReadyAndAssign)
router.get('/staff-dashboard',auth,isStaff,getStaffDashboard)

router.post('/verify-delivery',auth,completeOrder)
router.get('/my-task',auth,getMyTask)

export default router