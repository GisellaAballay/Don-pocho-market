
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Obtener el carrito del usuario
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('item.product');
    if ( !cart ) return res.status(404).json({ message: 'Carrito no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' })
  }
};

//Agregar producto al carrito
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.item.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

// Actualizar cantidad de un producto
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

// Eliminar un producto del carrito
const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try{
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { item: { product: productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: 'CArrito no encontrado' });
    res.status(200).json(cart);
  } catch(error) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito' })
  }
}

//Vaciar el carrito
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

module.exports = {getCart, addToCart, updateCartItem, removeFromCart, clearCart}; 