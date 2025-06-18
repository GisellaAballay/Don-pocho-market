
import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Obtener el carrito del usuario logueado 
router.get('/', auth, getCart);

//Agregar un producto al carrito
router.post('/add', auth, addToCart);

// Actualizar cantidad de un producto en el carrito 
router.put('/update', auth, updateCartItem);

// Eliminar un producto del carrito
router.delete('/remove', auth, removeFromCart);

// Vaciar el carrito
router.delete('/remove', auth, clearCart);

export { router }