// Standard response formatter
export const responseHandler = (req, res, next) => {
  res.success = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };

  res.error = (message = 'Error', statusCode = 500, errors = null) => {
    res.status(statusCode).json({
      status: 'error',
      message,
      statusCode,
      ...(errors && { errors }),
      timestamp: new Date().toISOString()
    });
  };

  next();
};
