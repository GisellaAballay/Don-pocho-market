
import User from '../models/User.js';

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

export { getProfile } 
