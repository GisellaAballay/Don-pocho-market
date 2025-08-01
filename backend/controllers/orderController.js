
import { NetworkContextImpl } from 'twilio/lib/rest/supersim/v1/network.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import sendWhatsApp from '../utils/sendWhatsApp.js';
import Cart from '../models/Cart.js';


const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }
     
    const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newOrder = new Order ({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      deliveryMethod: req.body.deliveryMethod,
      paymentMethod: req.body.paymentMethod,
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

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error obtenido órdenes: ', error);
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};

const getOrderById = async (req, res) => {
  try{
    const order = await Order.findById(req.params.id).populate('items.product');

    if(!order) {
      res.status(400);
      throw new Error('Orden no encontrada');
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Acceso denegado');
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async(req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pendiente', 'pagado', 'en preparación', 'enviado', 'entregado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) { return res.status(404).json({ message: 'Orden no encontrada' })}

    order.status = status;
    const updateOrder = await order.save();

    const user = await User.findById(order.user);

    if (user.notificationPreference === 'email') { 
      await sendEmail({ 
        to: user.email,
        subject: 'Actualización de tu pedido',
        html: `Hola ${user.name || ''}, el estado de tu pedido de Don Pocho ha sido actualizado a: ${order.status}`
      });
    } else if (user.notificationPreference === 'whatsapp') {
      await sendWhatsApp({
        to: user.phoneNumber,
        subject: `Hola ${user.name || ''}, el estado de tu pedido de Don Pocho ha sido actualizado a: ${order.status}`
      });
    }

    if (order.status === 'pagado') {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPhone = process.env.ADMIN_PHONE;

      await sendEmail({
        to : adminEmail,
        subject: 'Nuevo pedido confirmado',
        html: `Hay un nuevo pedido confirmado: ${order._id}`
        });
      await sendWhatsApp({
        to: adminPhone,
        subject: `Pedido confirmado: ${order._id}`
      }); 
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
      .populate('user', 'name email') 
      .sort({ createAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las órdenes', error })
  }
};

export { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders };