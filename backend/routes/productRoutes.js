
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin'); 

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

//Productos públicos
router.get('/', getAllProducts);
router.get('/:id', getProductById);

//Solo el admin (crear middleware isAdmin)
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
