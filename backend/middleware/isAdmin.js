
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verificando rol de administrador' })
  }
};

module.exports = isAdmin;