
import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
//import { protect } from '../middlewares/authMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);

export default router;
