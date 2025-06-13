
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res) => {
  try {
    const { name, email, password } =req.body;

  // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios'});
    }
  
  // Comprobar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'Este email ya está registrado' });
    }

  // Hashear Contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
  
  // Crear usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

  // Crear token de verificación
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
   
  // link de verificación
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  //Enviar email 
    await sendEmail(email, 'Verificá tu cuenta', `<h2>Hola ${name}</h2>
    <p>Gracias por registrarte. Hacé clic en el siguiente enlace para verificartu email:</p>
    <a href="${verifyUrl}">Verificar cuenta</a>
    `);

    res.status(201).json({ message: 'Usuario creado. Verificá tu email.' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({message: 'Error al registrar usuario'})
  }
};

module.exports = { register };