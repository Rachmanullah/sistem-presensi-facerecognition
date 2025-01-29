const express = require('express');
const { thAkademikController } = require('../controller');

const router = express.Router();
router.get('/', thAkademikController.HandlerGetAllThAkademik);
router.get('/:id', thAkademikController.HandlerGetThAkademikByID);
router.post('/', thAkademikController.HandlerCreateThAkademik);
router.put('/:id', thAkademikController.HandlerUpdateThAkademik);
router.delete('/:id', thAkademikController.HandlerDeleteThAkademik);
module.exports = router;