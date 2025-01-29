const express = require('express');
const { laboratoriumController } = require('../controller');

const router = express.Router();
router.get('/', laboratoriumController.handlerGetAllLaboratorium);
router.get('/:id', laboratoriumController.handlerGetLaboratoriumByID);
router.get('/count/total', laboratoriumController.handlerCountLaboratorium);
router.post('/', laboratoriumController.HandlerCreateLaboratorium);
router.put('/:id', laboratoriumController.handlerUpdateLaboratorium);
router.delete('/:id', laboratoriumController.handlerDeleteLaboratorium);
module.exports = router;