const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const alertController = require('../controllers/alertController');

router.get('/', authMiddleware, alertController.getAllAlerts);
router.get('/:id', authMiddleware, alertController.getAlertById);
router.patch('/:id/resolve', authMiddleware, alertController.resolveAlert);

module.exports = router;
