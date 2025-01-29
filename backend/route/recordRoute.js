const express = require('express');
const { recordAbsensiController } = require('../controller');

const router = express.Router();
router.get('/:id', recordAbsensiController.handleGetRecordAbsenByID);
router.get('/absensi/:absensiID', recordAbsensiController.handleGetRecordAbsenByAbsensiID);
router.get('/absensi/:absensiID/:mhsID', recordAbsensiController.handleCheckRecordAbsensi);
router.post('/', recordAbsensiController.handleCreateRecordAbsensi);
router.put('/presensi/:id', recordAbsensiController.handleRecordAbsensi);
router.put('/:id', recordAbsensiController.handleUpdateRecordAbsensi);
router.delete('/:id', recordAbsensiController.handleDeleteRecordAbsensi);
router.delete('absensi/:absensiID', recordAbsensiController.handleDeleteRecordAbsensiByAbsensiID);
module.exports = router;