
const Order = require('../models/Order');

// PARA CREAR UNA NUEVA ORDEN 
const createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, paymentMethod, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La orden no puede estar vacía' })
    }

    const newOrder = new Order ({
      user: req.user.id,  //Obtenida desde el middleware auth
      items,
      deliveryMethod,
      paymentMethod,
      totalPrice
    });

    const saveOrder = await newOrder.save();
    res.status(201).json(saveOrder);
  } catch (error) {
    console.erros('Error creando orden:', error);
    res.status(500).json({ message: 'Error al crear la orden' });
  }
}; 

// OBTENER TODAS LAS ÓRDENES DEL USUARIO AUTENTICADO
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error obtenido órdenes: ', error);
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};

// OBTENER UNA ORDEN POR ID (PARA ADMINISTRADOR O DUEÑO)
const getOrderById = async (req, res) => {
  try{
    const order = await Order.findById(req.params.id).populate('items.product');

    if(!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // VALIDAR SI EL USUARIO PUEDE VER LA ORDEN 
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ message: 'Error al obtener la orden' });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };