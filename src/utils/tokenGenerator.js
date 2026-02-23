const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  const payload = {
    id: usuario._id,
    rol: usuario.rol,
  };

  const secret = process.env.JWT_SECRET || 'changeme';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
  generarToken,
};

