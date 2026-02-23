require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Conexión a base de datos (no en tests)
if (process.env.NODE_ENV !== 'test') {
  connectDatabase();
}

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configuración Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST - Autenticación y Roles',
      version: '1.0.0',
      description:
        'API REST profesional para gestión de usuarios con autenticación JWT y control de acceso basado en roles.',
    },
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.js', 'src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

// Arranque del servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

module.exports = app;

