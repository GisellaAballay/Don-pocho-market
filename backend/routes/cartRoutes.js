
import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Obtener el carrito del usuario logueado 
router.get('/', authMiddleware, getCart);

//Agregar un producto al carrito
router.post('/add', authMiddleware, addToCart);

// Actualizar cantidad de un producto en el carrito 
router.put('/update', authMiddleware, updateCartItem);

// Eliminar un producto del carrito
router.delete('/remove', authMiddleware, removeFromCart);

// Vaciar el carrito
router.delete('/clear', authMiddleware, clearCart);

export default router;