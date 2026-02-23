const User = require('../models/userModel');

const listarUsuarios = async () => {
  const usuarios = await User.find().select('-password');
  return usuarios;
};

const obtenerUsuarioPorId = async (id, solicitante) => {
  const usuario = await User.findById(id).select('-password');

  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (solicitante.rol !== 'admin' && String(solicitante.id) !== String(usuario._id)) {
    const error = new Error('No tiene permisos para acceder a este usuario.');
    error.statusCode = 403;
    throw error;
  }

  return usuario;
};

const actualizarUsuario = async (id, datos, solicitante) => {
  const usuario = await User.findById(id);

  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (solicitante.rol !== 'admin' && String(solicitante.id) !== String(usuario._id)) {
    const error = new Error('No tiene permisos para actualizar este usuario.');
    error.statusCode = 403;
    throw error;
  }

  if (datos.nombre !== undefined) usuario.nombre = datos.nombre;
  if (datos.email !== undefined) usuario.email = datos.email;
  if (datos.password !== undefined) usuario.password = datos.password;

  await usuario.save();

  const usuarioLimpio = usuario.toObject();
  delete usuarioLimpio.password;

  return usuarioLimpio;
};

const eliminarUsuario = async (id) => {
  const usuario = await User.findById(id);

  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await usuario.deleteOne();

  return { message: 'Usuario eliminado correctamente.' };
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};

