const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos o email ya existente
 */
router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Debe proporcionar un email válido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  ],
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcto
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe proporcionar un email válido.'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
  ],
  authController.login
);

module.exports = router;

