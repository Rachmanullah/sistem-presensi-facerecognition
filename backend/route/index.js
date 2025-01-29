const express = require('express');
const router = express.Router();

const userRouter = require('./userRoute');
const thAkademikRouter = require('./thAkademikRoute');
const mahasiswaRouter = require('./mahasiswaRoute');
const laboratoriumRouter = require('./laboratoriumRoute');
const praktikumRouter = require('./praktikumRoute');

router.use('/user', userRouter);
router.use('/tahunAkademik', thAkademikRouter);
router.use('/mahasiswa', mahasiswaRouter);
router.use('/laboratorium', laboratoriumRouter);
router.use('/praktikum', praktikumRouter);
module.exports = router;