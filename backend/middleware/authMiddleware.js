
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si hay token
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //contiene id y role
    next(); //continuar hacia la ruta protegida
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido o expirado'})
  }
};

export default authMiddleware;