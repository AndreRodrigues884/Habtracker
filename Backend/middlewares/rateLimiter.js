const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiadas tentativas de login. Tenta novamente em 15 minutos.',
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registos por hora por IP
  message: 'Demasiadas tentativas de registo. Tenta novamente mais tarde.',
});

module.exports = { loginLimiter, registerLimiter };