const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redis = require('../utils/redis');

const defaultLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  limit: 100, 
  standardHeaders: true,
  legacyHeaders: false,
});

const limits = {
  FREE: 5000,
  PREMIUM: 50000,
  PRO: 300000,
  UNLIMITED: 1000000
};

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: async (req, res) => {
    if (req.user && req.user.planType) {
      return limits[req.user.planType] || 5000;
    }
    return 5000;
  },
  standardHeaders: 'draft-7', // To use X-RateLimit-* headers
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.apiKey ? req.apiKey.key : (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown');
  },
  handler: (req, res) => {
    res.status(429).json({ success: false, error: 'RATE_LIMITED', message: 'Daily quota exceeded' });
  }
});

module.exports = { defaultLimiter, apiLimiter };
