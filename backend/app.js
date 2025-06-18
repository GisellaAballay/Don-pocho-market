
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
//Middlewares
app.use(cors());
app.use(express.json());


// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// Agregar ruta admin

// Conexión a MongoDB y servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
});

// Conexión a la base de datos
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB conectado'))
//   .catch((err) => console.error('Error conectando MongoDB:', err));

//   // Servidor
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
