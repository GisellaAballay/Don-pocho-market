
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js'; 
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from '../controllers/productController.js';

const router = express.Router();

//Productos públicos
router.get('/', getAllProducts);
router.get('/:id', getProductById);

//Solo el admin (crear middleware isAdmin)
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

export default router;
