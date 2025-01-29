const praktikumService = require('./praktikumService');
const { absensiModels, pesertaModels, recordAbsensiModels } = require('../model');
const { absensiValidation } = require('../utils/validationHelper');
const { fromZonedTime, toZonedTime } = require('date-fns-tz');

const TIMEZONE = 'Asia/Jakarta';

const findAllAbsensi = async () => {
    try {
        return await absensiModels.findAllAbsensi();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findAbsensiByID = async (labID) => {
    try {
        return await absensiModels.findAbsensiById(labID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findAbsensiByPraktikumID = async (praktikumID) => {
    try {
        return await absensiModels.findAbsensiByPraktikumID(praktikumID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createAbsensi = async (absensiData) => {
    try {
        await absensiValidation.validate(absensiData, { abortEarly: false });
        const praktikumID = parseInt(absensiData.praktikum_id);
        const praktikum = await praktikumService.findPraktikumByID(praktikumID);
        const pertemuan = parseInt(absensiData.pertemuan);

        if (!praktikum) {
            throw new Error('praktikum Not found');
        }

        const pesertaPraktikum = await pesertaModels.FindPesertaPraktikumByPraktikumIDAndKelas(praktikumID, absensiData.kelas);

        if (!pesertaPraktikum || pesertaPraktikum.length === 0) {
            throw new Error('Peserta Praktikum Tidak Ada');
        }

        const checkAbsensi = await absensiModels.findAbsensiByPraktikumIDandKelasAndPertemuan(praktikumID, absensiData.kelas, pertemuan);

        if (checkAbsensi && checkAbsensi.length > 0) {
            throw new Error('Absensi Sudah Tersedia');
        }

        const tanggal = new Date(absensiData.tanggal);
        const startTime = fromZonedTime(absensiData.start_time, TIMEZONE); // UTC

        const localStartTime = toZonedTime(startTime, TIMEZONE); // Waktu lokal Asia/Jakarta
        const durasiMenit = parseInt(absensiData.durasi, 10);
        const endTime = new Date(localStartTime.getTime() + durasiMenit * 60000);

        const currentTime = toZonedTime(new Date(), TIMEZONE); // Waktu lokal sekarang
        const status = currentTime < localStartTime ? "Ditutup" : "Dibuka";

        const newData = {
            ...absensiData,
            tanggal: tanggal.toISOString(),
            start_time: startTime.toISOString(),
            end_time: fromZonedTime(endTime, TIMEZONE).toISOString(), // Konversi ke UTC
            status: status
        };
        console.log(newData)

        const absensiResult = await absensiModels.createAbsensi(newData);

        const records = pesertaPraktikum.map((peserta) => ({
            absensiID: absensiResult.id,
            mahasiswaID: peserta.mahasiswa_id,
            status: "Belum Absen"
        }));

        await Promise.all(records.map(recordAbsensiModels.createRecordAbsensi));

        return absensiResult;
    } catch (error) {
        throw error;
    }
}

const updateAbsensi = async (absensiID, absensiData) => {
    try {
        await absensiValidation.validate(absensiData, { abortEarly: false });

        const absensi = await absensiModels.findAbsensiById(absensiID);

        if (!absensi) {
            throw new Error('Data Not Found');
        }

        if (absensi.status !== "Dibuka") {
            throw new Error('Absensi sudah ditutup dan tidak dapat diubah');
        }

        // Ambil tanggal dan waktu mulai baru dari data
        const tanggal = new Date(absensiData.tanggal);
        const startTime = fromZonedTime(absensiData.start_time, TIMEZONE); // UTC

        // Konversi start_time ke waktu lokal
        const localStartTime = toZonedTime(startTime, TIMEZONE); // Waktu lokal Asia/Jakarta

        // Hitung end_time berdasarkan durasi dalam menit (jika ada perubahan durasi)
        const durasiMenit = parseInt(absensiData.durasi, 10); // dalam menit
        const endTime = new Date(localStartTime.getTime() + durasiMenit * 60000); // Tambahkan durasi dalam milidetik

        // Tentukan status berdasarkan waktu saat ini
        const currentTime = toZonedTime(new Date(), TIMEZONE); // Waktu lokal sekarang
        const status = currentTime < localStartTime ? "Ditutup" : "Dibuka";

        // Buat data baru untuk absensi yang akan diupdate
        const updatedData = {
            ...absensi, // Menyalin data lama yang tidak berubah
            ...absensiData, // Menyertakan data baru dari form (tanggal, durasi, dll.)
            tanggal: tanggal.toISOString(),
            start_time: startTime.toISOString(),
            end_time: fromZonedTime(endTime, TIMEZONE).toISOString(), // Konversi ke UTC
            status: status,
        };

        return await absensiModels.updateAbsensi(absensiID, updatedData);
    } catch (error) {
        throw error;
    }
}

const deleteAbsensi = async (absensiID) => {
    try {
        await recordAbsensiModels.deleteRecordAbsensiByAbsensiID(absensiID);
        return await absensiModels.destroyAbsensi(absensiID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findAllAbsensi,
    findAbsensiByID,
    findAbsensiByPraktikumID,
    createAbsensi,
    updateAbsensi,
    deleteAbsensi,
}