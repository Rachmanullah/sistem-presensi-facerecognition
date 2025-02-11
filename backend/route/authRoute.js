const express = require('express');
const { userController } = require('../controller');

const router = express.Router();
router.get('/logout/:id', userController.HandlerLogout);
router.post('/', userController.HandlerAuthenticateUser);
module.exports = router;