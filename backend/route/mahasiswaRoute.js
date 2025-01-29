const express = require('express');
const { mahasiswaController } = require('../controller');

const router = express.Router();
router.get('/', mahasiswaController.handlerGetAllMhs);
router.get('/:id', mahasiswaController.handlerGetMhsById);
router.get('/nim/:nim', mahasiswaController.handlerGetMhsByNIM);
router.get('/count/total', mahasiswaController.handlerCountMhs);
router.post('/', mahasiswaController.handlerCreateMhs);
router.put('/:id', mahasiswaController.handlerUpdateMhs);
router.delete('/:id', mahasiswaController.handlerDeleteMhs);
module.exports = router;