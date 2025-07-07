
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middleware/errorHandler.js';

import dotenv from 'dotenv';
dotenv.config();

connectDB();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);
// Falta Agregar ruta admin?

// Conexión en el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

