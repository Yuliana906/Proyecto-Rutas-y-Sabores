const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError('Acceso denegado: token no proporcionado', 401);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    throw new AppError('Token inválido o expirado', 403);
  }
};

const checkRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    throw new AppError('No tienes permisos para esta acción', 403);
  }
  next();
};

module.exports = { verifyToken, checkRole };