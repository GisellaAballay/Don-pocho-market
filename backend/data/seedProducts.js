
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const products = [
   {
    name: 'Yerba Mate',
    description: 'Yerba suave sin palo',
    price: 1500,
    stock: 50,
    image: 'https://via.placeholder.com/150',
    category: 'Bebidas'
  },
  {
    name: 'Fideos Spaghetti',
    description: 'Paquete de 500g de fideos de trigo',
    price: 700,
    stock: 120,
    image: 'https://via.placeholder.com/150',
    category: 'Almacén'
  },
  {
    name: 'Aceite de Girasol',
    description: 'Botella de 1L',
    price: 2500,
    stock: 80,
    image: 'https://via.placeholder.com/150',
    category: 'Despensa'
  },
  {
    name: 'Galletitas de Chocolate',
    description: 'Paquete 300g',
    price: 850,
    stock: 90,
    image: 'https://via.placeholder.com/150',
    category: 'Golosinas'
  },{
    name: 'Salame picado fino',
    description: 'Salame artesanal picado fino.',
    price: 1200,
    stock: 100,
    image: 'https://via.placeholder.com/150',
    category: 'Fiambres'
  },
  {
    name: 'Queso sardo',
    description: 'Queso curado ideal para picadas.',
    price: 2400,
    stock: 50,
    image: 'https://via.placeholder.com/150',
    category: 'Quesos'
  },
];

const seedProducts = async () => {
  try {
    console.log('URI de Mongo:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    await Product.deleteMany();
    console.log('Productos eliminados');

    await Product.insertMany(products);
    console.log('Productos insertados con éxito');

    process.exit();
  } catch (error) {
    console.error('Error al insertar producto:', error.message);
    process.exit(1);
  }
};

seedProducts();