
import Cart from '../models/Cart.js';
import mongoose from 'mongoose';


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if ( !cart ) return res.status(404).json({ message: 'Carrito no encontrado' });
    return res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' })
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)){
  return res.status(400).json({ message: 'ID de producto no válido'})
  };

  const parsedQuantity = parseInt(quantity);
  if (!parsedQuantity || parsedQuantity < 1) {
    return res.status(400).json({ message: 'Cantidad inválida' });
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cart.items.push({ product: productId, quantity: parsedQuantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try{
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Producto no está en el carrito' });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
}; 

const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try{
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.status(200).json(cart);
  } catch(error) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito' })
  }
}

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if(!cart) return res.status(400).json({ message: 'Carrito no encontrado' });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart }; 