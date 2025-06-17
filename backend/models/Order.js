
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  deliveryMethod: {
    type: String,
    enum: ['delivery', 'takeaway'],
    required: true
  },
  paymentMethod:{
    type: String,
    enum: ['MercadoPago', 'MODO'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'pagado', 'en preparación', 'enviado', 'entregado'],
    default: 'pendiente'
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);