const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/apiAuth');

// Protected admin routes
router.use(authenticateToken); // For real app, ensure req.userToken is Admin

router.get('/users', adminController.getUsers);
router.put('/users/:id/approve', adminController.approveUser);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
