const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit to 10 requests per IP
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginRateLimiter;
