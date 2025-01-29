const express = require('express');
const router = express.Router();

const userRouter = require('./userRoute');
const thAkademikRouter = require('./thAkademikRoute');
const mahasiswaRouter = require('./mahasiswaRoute');
const laboratoriumRouter = require('./laboratoriumRoute');
const praktikumRouter = require('./praktikumRoute');
const absensiRouter = require('./absensiRoute');
const recordRouter = require('./recordRoute');
const checkAbsensiStatus = require('./checkAbsensi');

router.use('/user', userRouter);
router.use('/tahunAkademik', thAkademikRouter);
router.use('/mahasiswa', mahasiswaRouter);
router.use('/laboratorium', laboratoriumRouter);
router.use('/praktikum', praktikumRouter);
router.use('/absensi', absensiRouter);
router.use('/record', recordRouter);
router.use('/checkAbsensi', checkAbsensiStatus);

module.exports = router;