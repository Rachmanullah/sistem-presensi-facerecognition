const express = require('express');
const { absensiController } = require('../controller');

const router = express.Router();
router.get('/', absensiController.);

module.exports = router;