const express = require('express');
const { absensiController } = require('../controller');

const router = express.Router();
router.get('/', absensiController.handlerGetAllAbsensi);
router.get('/:id', absensiController.handleGetAbsensiByID);
router.get('/praktikum/:praktikumID', absensiController.handleGetAbsensiByPraktikumID);
router.post('/', absensiController.handleCreateAbsensi);
router.put('/:id', absensiController.handleUpdateAbsensi);
router.delete('/:id', absensiController.handleDeleteAbsensi);
module.exports = router;