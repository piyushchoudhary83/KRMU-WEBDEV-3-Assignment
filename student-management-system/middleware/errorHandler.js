function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  console.error(err.stack || err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}

module.exports = {
  notFound,
  errorHandler
};