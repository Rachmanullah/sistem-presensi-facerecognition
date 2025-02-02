const userService = require('./userService');
const mahasiswaService = require('./mahasiswaService');
const thAkademikService = require('./thAkademikService');
const laboratoriumService = require('./laboratoriumService');
const praktikumService = require('./praktikumService');
const pesertaService = require('./pesertaService');
const absensiService = require('./absensiService');
const recordAbsensiService = require('./recordAbsensiService');
const faceRecognitionService = require('./faceRecognitonService');

module.exports = {
    userService,
    mahasiswaService,
    thAkademikService,
    laboratoriumService,
    praktikumService,
    pesertaService,
    absensiService,
    recordAbsensiService,
    faceRecognitionService
}