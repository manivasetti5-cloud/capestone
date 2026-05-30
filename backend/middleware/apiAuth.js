const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/db');
const redis = require('../utils/redis');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'FORBIDDEN' });
    req.userToken = user;
    next();
  });
};

const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ success: false, error: 'INVALID_API_KEY', message: 'Missing API Key' });
  }

  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: { include: { stateAccessRules: true } } }
    });

    if (!keyRecord || keyRecord.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, error: 'INVALID_API_KEY', message: 'Invalid or revoked API Key' });
    }

    // If write operation (POST, PUT, DELETE, PATCH), require secret
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const apiSecret = req.headers['x-api-secret'];
      if (!apiSecret) {
        return res.status(401).json({ success: false, error: 'INVALID_API_KEY', message: 'Missing API Secret for write operation' });
      }
      const isValidSecret = await bcrypt.compare(apiSecret, keyRecord.secretHash);
      if (!isValidSecret) {
         return res.status(401).json({ success: false, error: 'INVALID_API_KEY', message: 'Invalid API Secret' });
      }
    }

    // Attach user and key to request
    req.user = keyRecord.user;
    req.apiKey = keyRecord;

    next();
  } catch (error) {
    console.error('API Auth Error:', error);
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

module.exports = { authenticateToken, authenticateApiKey };