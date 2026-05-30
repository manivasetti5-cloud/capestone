const crypto = require('crypto');

const responseFormatter = (req, res, next) => {
  req.requestId = `req_${crypto.randomBytes(12).toString('hex')}`;
  req.startTime = Date.now();

  const originalJson = res.json;

  res.json = function (body) {
    // If the body is already formatted or has an error, we still want to wrap it but handle it gracefully
    const isError = res.statusCode >= 400 || (body && body.success === false);
    
    // We only want to format if it's not already formatted according to standard
    if (body && typeof body === 'object' && body.meta && body.success !== undefined) {
      return originalJson.call(this, body);
    }

    const responseTime = Date.now() - req.startTime;

    const formattedResponse = {
      success: !isError,
      count: body && body.data ? body.data.length : (Array.isArray(body) ? body.length : undefined),
      data: isError ? undefined : (body.data || body),
      error: isError ? (body.error || 'ERROR') : undefined,
      message: isError ? body.message : undefined,
      meta: {
        requestId: req.requestId,
        responseTime: responseTime,
        rateLimit: res.getHeader('ratelimit-limit') ? {
          limit: res.getHeader('ratelimit-limit'),
          remaining: res.getHeader('ratelimit-remaining'),
          reset: new Date(res.getHeader('ratelimit-reset') * 1000).toISOString()
        } : undefined
      }
    };

    return originalJson.call(this, formattedResponse);
  };

  next();
};

module.exports = responseFormatter;
