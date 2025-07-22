
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const register = async (req, res) => {
  try {
    const { name, email, password } =req.body;
     console.log('Datos recibidos:', { name, email, password });
  // Validación básica
    if (!name || !email || !password) {
      console.log('Faltan campos obligatorios');
      return res.status(400).json({ message: 'Todos los campos son obligatorios'});
    }
  
  // Comprobar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Usuario ya existe')
      return res.status(409).json({ message: 'Este email ya está registrado' });
    }

  // Hashear Contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña hasheada');

  
  // Crear usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

     console.log('Usuario creado:', newUser);

  // Crear token de verificación
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
   
  // link de verificación
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    console.log('Token generado y link de verificación creado');

  //Enviar email 
    try{
      await sendEmail({
      to: newUser.email,
      subject: 'Verifica tu cuenta',
      html:`
            <h2>Hola ${name}</h2> 
             
            <p>Gracias por registrarte. Haz clic aquí para verificar tu cuenta:</p>
            <a href="${verifyUrl}" target="_blank">Verificar email</a>

            <p>Este enlace expirará en 24 horas.</p>
          `
      });
      
    } catch (emailError) {
      console.error('Error al enviar email de verificación:', emailError.message);
    }

    res.status(201).json({ message: 'Usuario creado. Verificá tu email.' });
  } catch (error) {
    console.error('Error en registro:', error); 
    res.status(500).json({message: 'Error al registrar usuario'})
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token faltante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'La cuenta ya fue verificada' });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada correctamente' });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación simple
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña obligatorios' });
  }

  try {
    const user = await User.findOne({ email });

    // Verificar existencia
    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña inválidos' });
    }

    // Verificar si está verificado
    if (!user.verified) {
      return res.status(403).json({ message: 'Debes verificar tu email para iniciar sesión' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email o contraseña inválidos' });
    }

    // Crear token de acceso
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const existingCart = await Cart.findOne({ user: user._id });

    if (!existingCart) {
      const newCart = new Cart ({
      user: user._id,
      items: [],
      });
      await newCart.save();
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};


export { register, verifyEmail, login };