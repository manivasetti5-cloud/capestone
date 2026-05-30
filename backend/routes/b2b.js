const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const b2bController = require('../controllers/b2bController');
const { authenticateToken } = require('../middleware/apiAuth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/keys', authenticateToken, authController.generateApiKey);
router.get('/keys', authenticateToken, b2bController.getKeys);
router.delete('/keys/:id', authenticateToken, b2bController.revokeKey);
router.get('/usage', authenticateToken, b2bController.getUsage);

module.exports = router;
