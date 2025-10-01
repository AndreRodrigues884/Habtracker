const errorHandler = require('./errorHandler');

function errorResponse(req, res, next) {
  res.error = (errorKey) => {
    const error = errorHandler[errorKey] || {
      message: 'Erro desconhecido.',
      status: 500,
    };

    return res.status(error.status).json({ message: error.message });
  };

  next();
}

module.exports = errorResponse;
