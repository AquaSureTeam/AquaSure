const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const readingController = require('../controllers/readingController');

router.post('/', readingController.ingestReading);

router.get('/latest', authMiddleware, readingController.getLatestReadings);
router.get('/:deviceId/history', authMiddleware, readingController.getDeviceHistory);
router.get('/:deviceId', authMiddleware, readingController.getDeviceReadings);
router.get('/', authMiddleware, readingController.getAllReadings);

module.exports = router;
