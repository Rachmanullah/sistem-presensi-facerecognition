const express = require('express');
const upload = require('../utils/uploadImage');
const { faceRecognitionController } = require('../controller');

const router = express.Router();
router.post('/register', upload.array("photos", 10), faceRecognitionController.handleRegister);
router.post('/predict', faceRecognitionController.handlePredictFace);
router.get('/count', faceRecognitionController.handleCountImagesFace);
router.get('/:mhsID', faceRecognitionController.handleGetImagesByMhsID);
module.exports = router;