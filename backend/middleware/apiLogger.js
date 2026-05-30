const prisma = require('../utils/db');

const apiLogger = (req, res, next) => {
  res.on('finish', () => {
    // Only log if we have an API Key or User, avoiding logging general frontend visits or health checks here.
    // If you want to log all requests, you could remove this check.
    if (req.apiKey && req.user) {
      const responseTime = Date.now() - req.startTime;
      
      // Fire and forget logging
      prisma.apiLog.create({
        data: {
          endpoint: req.originalUrl.split('?')[0],
          responseTime: responseTime,
          statusCode: res.statusCode,
          ipAddress: req.ip || req.connection.remoteAddress,
          userId: req.user.id,
          apiKeyId: req.apiKey.id
        }
      }).catch(err => {
        console.error('Failed to log API request:', err);
      });
    }
  });

  next();
};

module.exports = apiLogger;
