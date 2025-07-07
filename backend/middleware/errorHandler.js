
const errorHandler = (err, req, res, next) => {
  console.error('Error: ', err.stack || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Error interno en el servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler;
