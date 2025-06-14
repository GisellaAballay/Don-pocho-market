
const express = require('express');
const router = express.Router();
const {getCart, addToCart, updateCartItem, removeFromCart, clearCart} = require('../controllers/cartController');

const auth = require('../middleware/authMiddleware'); //Protege rutas para usuarios logueados

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

module.exports = router;