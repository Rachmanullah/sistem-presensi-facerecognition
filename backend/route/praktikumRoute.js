const express = require('express');
const { praktikumController, pesertaController } = require('../controller');

const router = express.Router();
router.get('/', praktikumController.handlerGetAllPraktikum);
router.get('/:id', praktikumController.handlerGetPraktikumByID);
router.get('/count/total', praktikumController.handlerCountPraktikum);
router.post('/', praktikumController.HandlerCreatePraktikum);
router.put('/:id', praktikumController.handlerUpdatePraktikum);
router.delete('/:id', praktikumController.handlerDeletePraktikum);
router.get('/:praktikumID/peserta', pesertaController.handleGetPesertaPraktikumByPraktikumID);
router.post('/peserta', pesertaController.handlerCreatePeserta);
router.put('/peserta/:pesertaID', pesertaController.handlerUpdatePeserta);
router.delete('/peserta/:pesertaID', pesertaController.handlerDeletePeserta);

module.exports = router;