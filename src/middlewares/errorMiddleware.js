// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorMiddleware;

