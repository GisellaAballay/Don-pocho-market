
const User = require('../models/User');

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

module.exports = {
  getProfile,
  // otros métodos que vayas agregando como updateUser, deleteUser, etc.
};
