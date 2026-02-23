const User = require('../models/userModel');
const { generarToken } = require('../utils/tokenGenerator');

const register = async ({ nombre, email, password, rol }) => {
  const existente = await User.findOne({ email });
  if (existente) {
    const error = new Error('El email ya está registrado.');
    error.statusCode = 400;
    throw error;
  }

  const usuario = await User.create({
    nombre,
    email,
    password,
    rol: rol || 'user',
  });

  const token = generarToken(usuario);

  return {
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      fechaCreacion: usuario.fechaCreacion,
    },
  };
};

const login = async ({ email, password }) => {
  const usuario = await User.findOne({ email });
  if (!usuario) {
    const error = new Error('Credenciales inválidas.');
    error.statusCode = 401;
    throw error;
  }

  const esValido = await usuario.compararPassword(password);
  if (!esValido) {
    const error = new Error('Credenciales inválidas.');
    error.statusCode = 401;
    throw error;
  }

  if (!usuario.activo) {
    const error = new Error('La cuenta está desactivada.');
    error.statusCode = 403;
    throw error;
  }

  const token = generarToken(usuario);

  return {
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      fechaCreacion: usuario.fechaCreacion,
    },
  };
};

module.exports = {
  register,
  login,
};

