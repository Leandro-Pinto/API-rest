const { validationResult } = require('express-validator');
const userService = require('../services/userService');

const getUsers = async (req, res, next) => {
  try {
    const usuarios = await userService.listarUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await userService.obtenerUsuarioPorId(id, req.user);
    return res.status(200).json(usuario);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const datos = req.body;
    const usuarioActualizado = await userService.actualizarUsuario(id, datos, req.user);
    return res.status(200).json(usuarioActualizado);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await userService.eliminarUsuario(id);
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

