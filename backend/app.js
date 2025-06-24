
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

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
// Agregar ruta admin

// Conexión a MongoDB y servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error de conexión a MongoDB:', err.message);
  });

