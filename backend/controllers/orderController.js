
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendWhatsApp } from '../utils/sendWhatsApp.js';

// PARA CREAR UNA NUEVA ORDEN 
const createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La orden no puede estar vacía' })
    }

    // Calcular valor de la venta automáticamente 
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    if (!order) { return res.status(400).json({ message: 'Orden no encontrada' })}

    order.status = status;
    const updateOrder = await order.save();

    //Obtener datos del usuario
    constuser = await User.findById(order.user);

    //Notificar al usuario
    if (user.notificationPreference === 'email') { 
      await sendEmail(user.email, 'Actualización de tu pedido', `Tu pedido ahora está: ${order.status}`);
    } else if (user.notificationPreference === 'whatsapp') {
      await sendWhatsApp(user.phoneNumber, `Tu pedido ahora está: ${order.status}`);
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


export { createOrder, getUserOrders, getOrderById, updateOrderStatus };