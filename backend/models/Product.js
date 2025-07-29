
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'general'
  },
  imageUrl: String, 
  offer: {
    type: Boolean,
    default: false
  },
  offerPrice: Number
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
