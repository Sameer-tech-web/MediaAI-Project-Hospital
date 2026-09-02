const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || 'Internal Server Error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(', ');
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}`;
  } else if (error.code === 11000) {
    const duplicateFields = Object.keys(error.keyPattern || error.keyValue || {});

    if (duplicateFields.includes('email')) {
      statusCode = 400;
      message = 'User already exists';
    } else if (
      duplicateFields.includes('mrn') ||
      duplicateFields.includes('orderNumber')
    ) {
      statusCode = 409;
      message = 'A record with this identifier already exists';
    } else {
      statusCode = 409;
      message = `Duplicate value for ${duplicateFields.join(', ') || 'field'}`;
    }
  } else if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
  ) {
    statusCode = 401;
    message = 'Not authorized, token failed';
  }

  const response = { message };

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
