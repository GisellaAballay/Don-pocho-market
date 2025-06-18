//Este permite guardar productos que un usuario quiera comprar, antes de confirmar su pedido

import mongoose from "mongoose";
//const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    requires: true,
  },
  quantity:{
    type: Number,
    required: true,
    min: 1
  }
});

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

module.export = mongoose.model('Cart', cartSchema);