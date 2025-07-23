
import express from 'express';
import { getProfile, rehashAdmin } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);

router.get('/rehash-admin', async (req,res) => {
  try {
    const admin = await User.findOne({ isAdmin: true});
    if (!admin) return res.status(404).json({ messsage: "Admin no encontrado" });

    admin.markModified('password');
    await admin.save();

    res.json({ message: "Contraseña rehasheada correctamente" })
  } catch (err) {
    res.status(500).json({ message: "Error de rehashear", error: err.message })
  }
})

export default router;
