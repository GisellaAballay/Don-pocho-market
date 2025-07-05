
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
};

export default adminMiddleware;