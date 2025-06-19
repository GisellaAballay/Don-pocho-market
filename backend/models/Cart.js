//Este permite guardar productos que un usuario quiera comprar, antes de confirmar su pedido

import mongoose from "mongoose";

//Esquema de un item para el carrito
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity:{
    type: Number,
    required: true,
    min: 1
  }
});

//Esquema ppal del carrito
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true //Para que sea un carrito por usuario
  },
  items: [cartItemSchema],
  updateAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;