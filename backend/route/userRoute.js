const express = require('express');
const { userController } = require('../controller');

const router = express.Router();
router.get('/', userController.HandlerGetAllUsers);
router.get('/:id', userController.HandlerGetuserByID);
router.post('/', userController.HandlerCreateUser);
router.put('/:id', userController.HandlerUpdateUser);
router.delete('/:id', userController.HandlerDeleteUser);
module.exports = router;