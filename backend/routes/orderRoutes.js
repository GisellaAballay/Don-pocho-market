
const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrderStatus} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authMiddleware, createOrder);    //Crear una nueva orden
router.get('/', authMiddleware, getUserOrders);   //Ver todas las órdenes del usuario
router.get('/:id', authMiddleware, getOrderById);   //Ver orden específica por ID 
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);    //Cambiar el status de la orden 

module.exports = router;