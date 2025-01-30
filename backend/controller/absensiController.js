const { updateStatusAbsensi } = require("../model/absensiModels");
const { findRecordAbsensiByAbsensiID } = require("../model/recordAbsensiModels");
const { absensiService, recordAbsensiService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.handlerGetAllAbsensi = async (req, res) => {
    try {
        const presensi = await absensiService.findAllAbsensi();
        return responseHandler.success(res, presensi, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handleGetAbsensiByID = async (req, res) => {
    try {
        const dataID = parseInt(req.params.id);
        const result = await absensiService.findAbsensiByID(dataID);
        return responseHandler.success(res, result, 'Get Data Success', 200);
    } catch (error) {
        console.error('Error fetching data:', error);
        return responseHandler.error(res, error.message || 'Get Data failed', 401);
    }
}

exports.handleGetAbsensiByPraktikumID = async (req, res) => {
    try {
        const filterID = parseInt(req.params.praktikumID);
        const result = await absensiService.findAbsensiByPraktikumID(filterID);
        return responseHandler.success(res, result, 'Get Data Success', 200);
    } catch (error) {
        console.error('Error fetching data:', error);
        return responseHandler.error(res, error.message || 'Get Data failed', 401);
    }
}

exports.handleCreateAbsensi = async (req, res) => {
    try {
        const data = req.body;
        const presensi = await absensiService.createAbsensi(data);
        return responseHandler.success(res, presensi, 'created successfully', 201);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.assign(validationErrors, error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {}));
            console.error('Validation Errors:', validationErrors);
            return responseHandler.error(res, validationErrors, 400);
        } else {
            console.error('Unexpected Error:', error);
            return responseHandler.error(res, error.message, 500);
        }
    }
}

exports.handleUpdateAbsensi = async (req, res) => {
    try {
        const dataID = parseInt(req.params.id);
        const data = req.body;

        const updatedPresensi = await absensiService.updateAbsensi(dataID, data);
        return responseHandler.success(res, updatedPresensi, 'updated absensi successfully', 200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.assign(validationErrors, error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {}));
            console.error('Validation Errors:', validationErrors);
            return responseHandler.error(res, validationErrors, 400);
        } else {
            console.error('Unexpected Error:', error);
            return responseHandler.error(res, 'Internal Server Error', 500);
        }
    }
}

exports.handleDeleteAbsensi = async (req, res) => {
    try {
        const dataID = parseInt(req.params.id);
        await recordAbsensiService.deleteRecordAbsensiByAbsensiID(dataID);
        await absensiService.deleteAbsensi(dataID);
        return responseHandler.success(res, null, 'deleted Data Success', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.checkAbsensiStatus = async (req, res) => {
    try {
        const currentTime = new Date(); // Waktu lokal
        console.log(`Pengecekan absensi dijalankan pada: ${currentTime}`);

        const absensi = await absensiService.findAllAbsensi();
        console.log(`Ditemukan ${absensi.length} absensi untuk diperiksa.`);

        const updates = absensi.map(async (item) => {
            // Ambil start_time dan end_time sebagai waktu lokal
            const startTimeLocal = new Date(item.start_time); // Waktu mulai absensi
            const endTimeLocal = new Date(item.end_time); // Waktu akhir absensi

            console.log(`Memeriksa absensi ID ${item.id} - Status: ${item.status} - Start Time: ${startTimeLocal} - End Time: ${endTimeLocal}`);

            // Log untuk perbandingan waktu
            console.log(`Current Time: ${currentTime}, Start Time: ${startTimeLocal}, End Time: ${endTimeLocal}`);

            // Cek apakah waktu sekarang lebih besar dari start_time untuk membuka absensi
            if (currentTime >= startTimeLocal && item.status === 'Tutup') {
                console.log(`Membuka absensi ID ${item.id} - ${item.kelas}.`);
                await updateStatusAbsensi(item.id, { status: 'Dibuka' })
                console.log(`Absensi ID ${item.id} berhasil dibuka.`);
            }

            // Cek apakah waktu sekarang lebih besar dari end_time untuk menutup absensi
            if (currentTime >= endTimeLocal && item.status === 'Dibuka') {
                console.log(`Menutup absensi ID ${item.id} - ${item.kelas}.`);
                await updateStatusAbsensi(item.id, { status: 'Ditutup' })
                console.log(`Absensi ID ${item.id} berhasil ditutup.`);

                const praktikan = await findRecordAbsensiByAbsensiID(item.id);
                const filterPraktikan = praktikan.filter((item) => {
                    return item.status === 'Belum Absen';
                });

                await Promise.all(filterPraktikan.map(async (praktikanItem) => {
                    await recordAbsensiService.updateRecordAbsensi(praktikanItem.id, { status: 'Tidak Hadir' });
                }));

                console.log(`Semua praktikan yang belum absen pada absensi ID ${item.id} telah diubah menjadi 'Tidak Hadir'.`);
            } else {
                console.log(`Absensi ID ${item.id} tetap ${item.status}.`);
            }
        });

        await Promise.all(updates);
        console.log('Pengecekan absensi selesai.');
        return responseHandler.success(res, null, 'Pengecekan absensi berhasil', 200);
    } catch (error) {
        console.error('Error dalam pengecekan absensi:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}