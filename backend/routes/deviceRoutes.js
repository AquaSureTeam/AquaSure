const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const deviceController = require('../controllers/deviceController');

router.get('/', authMiddleware, deviceController.getAllDevices);
router.post('/', authMiddleware, deviceController.registerDevice);
router.get('/:id/status', authMiddleware, deviceController.getDeviceStatus);
router.patch('/:id', authMiddleware, deviceController.updateDevice);

module.exports = router;
