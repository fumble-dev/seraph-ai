import express from 'express'
import { purchasePlan, verifyPurchase } from '../controllers/creditController.js'
import { protect } from '../middlewares/auth.js'

const creditRouter = express.Router()

creditRouter.post('/buy', protect, purchasePlan)
creditRouter.post('/verfiy-purchase', protect, verifyPurchase)

export default creditRouter