
import { NetworkContextImpl } from 'twilio/lib/rest/supersim/v1/network.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import sendWhatsApp from '../utils/sendWhatsApp.js';
import Cart from '../models/Cart.js';

// PARA CREAR UNA NUEVA ORDEN 
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }
     
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order ({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      deliveryMethod: req.body.deliveryMethod || 'retiro',
      paymentMethod: req.body.paymentMethod || 'efectivo',
      totalPrice,
      status: 'pendiente'
    });

    await newOrder.save();
    
    res.status(201).json({
      message: 'Orden creada con éxito',
      order: newOrder
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
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
      res.status(400);
      throw new Error('Orden no encontrada');
    }

    // VALIDAR SI EL USUARIO PUEDE VER LA ORDEN 
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Acceso denegado');
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

//ACTUALIZAR ESTADO DE UNA ORDEN + NOTIFICACIONES
const updateOrderStatus = async(req, res) => {
  try {
    const { status } = req.body;

    // Validar estado permitido
    const validStatuses = ['pendiente', 'pagado', 'en preparación', 'enviado', 'entregado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) { return res.status(404).json({ message: 'Orden no encontrada' })}

    order.status = status;
    const updateOrder = await order.save();

    //Obtener datos del usuario
    const user = await User.findById(order.user);

    //Notificar al usuario
    if (user.notificationPreference === 'email') { 
      await sendEmail(user.email, 'Actualización de tu pedido', `Hola ${user.name || ''}, el estado de tu pedido de Don Pocho ha sido actualizado a: ${order.status}`);
    } else if (user.notificationPreference === 'whatsapp') {
      await sendWhatsApp(user.phoneNumber, `Hola ${user.name || ''}, el estado de tu pedido de Don Pocho ha sido actualizado a: ${order.status}`);
    }

    //Si el pedido está pago, notificar al admin
    if (order.status === 'pagado') {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPhone = process.env.ADMIN_PHONE;

      await sendEmail(adminEmail, 'Nuevo pedido confirmado', `Hay un nuevo pedido confirmado: ${order._id}`);
      await sendWhatsApp(adminPhone, `Pedido confirmado: ${order._id}`); 
    }

    res.status(200).json(updateOrder);
  } catch (error) {
    console.error('Error al actualizar el estado: ', error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
}

const getAllOrders = async (req, res) => {
  try{
    const orders = await Order.find()
      .populate('user', 'name email') //incluye nombre y email del usuario
      .sort({ createAt: -1 }); //Muestra las más recientes primero

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las órdenes', error })
  }
};

export { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders };