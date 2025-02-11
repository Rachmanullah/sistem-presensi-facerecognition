const express = require('express');
const { userController } = require('../controller');

const router = express.Router();
// router.get('/', userController.HandlerDeleteUser);
router.post('/', userController.HandlerAuthenticateUser);
module.exports = router;