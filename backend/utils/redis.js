const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    retryStrategy() { return null; } // Don't retry, let it fail silently for local dev
});

redis.on('error', (err) => {
    // console.warn('Redis connection error (Safe to ignore for local development):', err.message);
});

module.exports = redis;
