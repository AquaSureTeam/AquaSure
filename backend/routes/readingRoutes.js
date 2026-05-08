const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { addReading } = require('../controllers/readingController');

router.post('/', authMiddleware, addReading);



module.exports = router;