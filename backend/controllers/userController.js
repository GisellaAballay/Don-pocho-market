
import User from '../models/User.js';

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const rehashAdmin = async (req, res) => {
  try{
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message:'Usuario no encontrado' });

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: `El usuario ${email} ahora es administrador.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message })
  }
};

export { getProfile, rehashAdmin } 
