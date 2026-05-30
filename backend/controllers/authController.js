const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/db');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { email, password, businessName, phone, gstNumber } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, error: 'EMAIL_IN_USE' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, businessName, phone, gstNumber, status: 'ACTIVE' }
    });

    res.json({ success: true, message: 'Registration successful! You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, error: 'ACCOUNT_NOT_ACTIVE' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { id: user.id, email: user.email, planType: user.planType } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    const key = `ak_${crypto.randomBytes(16).toString('hex')}`;
    const secret = `as_${crypto.randomBytes(16).toString('hex')}`;
    const secretHash = await bcrypt.hash(secret, 10);

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        secretHash,
        userId: req.userToken.id
      }
    });

    res.json({ success: true, apiKey: key, apiSecret: secret, message: 'Store secret safely!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};
