import express from 'express'
const router = express.Router()
import {getMe} from '../controllers/authController.js'
import {toggleDuty} from '../controllers/userController.js'
import {auth} from '../middlewares/auth.js'

router.get('/me', auth, getMe);
router.put('/toggle-duty',auth,toggleDuty)


export default router