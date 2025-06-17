
const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);    //Crear una nueva orden
router.get('/', authMiddleware, getUserOrders);   //Ver todas las órdenes del usuario
router.get('/:id', authMiddleware, getOrderById);   //Ver orden específica por ID 

module.exports = router;