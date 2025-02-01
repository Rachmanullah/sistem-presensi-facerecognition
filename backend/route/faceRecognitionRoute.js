const express = require('express');
const { faceRecognitionController } = require('../controller');
const upload = require('../utils/uploadImage');

const router = express.Router();
router.post('/register', upload.array("photos", 10), faceRecognitionController.handleRegister);
module.exports = router;