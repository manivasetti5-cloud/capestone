const express = require('express');
const router = express.Router();
const geoController = require('../controllers/geoController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateApiKey } = require('../middleware/apiAuth');
const responseFormatter = require('../middleware/responseFormatter');
const apiLogger = require('../middleware/apiLogger');

// Apply middleware chain
router.use(responseFormatter);
router.use(authenticateApiKey);
router.use(apiLimiter);
router.use(apiLogger);

router.get('/states', geoController.getStates);
router.get('/states/:id/districts', geoController.getDistricts);
router.get('/districts/:id/subdistricts', geoController.getSubDistricts);
router.get('/subdistricts/:id/villages', geoController.getVillages);
router.get('/autocomplete', geoController.autocomplete);
router.get('/search', geoController.search);

module.exports = router;
