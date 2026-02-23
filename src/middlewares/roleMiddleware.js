const roleMiddleware = (...rolesPermitidos) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  if (!rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso.' });
  }

  return next();
};

module.exports = roleMiddleware;

