
import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import protect from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router();

router.use(protect);
router.post('/', authMiddleware, createOrder);    //Crear una nueva orden
router.get('/', authMiddleware, getUserOrders);   //Ver todas las órdenes del usuario
router.get('/:id', authMiddleware, getOrderById);   //Ver orden específica por ID 
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);    //Cambiar el status de la orden 
router.get('/admin/orders', authMiddleware, adminMiddleware, getAllOrders);

export default router;