
import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import protect from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router();

router.use(protect);
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById); 
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus); 
router.get('/admin/orders', authMiddleware, adminMiddleware, getAllOrders);
router.patch('/:id/status', protect, isAdmin, updateOrderStatus)

export default router;