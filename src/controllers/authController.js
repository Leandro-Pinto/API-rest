const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password, rol } = req.body;
    const resultado = await authService.register({ nombre, email, password, rol });

    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const resultado = await authService.login({ email, password });

    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};

