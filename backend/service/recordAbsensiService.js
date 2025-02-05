const { recordAbsensiModels, absensiModels, mahasiswaModels, pesertaModels } = require("../model");

const findRecordAbsenByID = async (recordID) => {
    try {
        return await recordAbsensiModels.findRecordAbsensiByID(recordID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findRecordAbsenByAbsensiID = async (absensiID) => {
    try {
        const dataPresensi = await absensiModels.findAbsensiById(absensiID);

        if (!dataPresensi) {
            throw new Error('Data Not Found');
        }

        const dataRecord = await recordAbsensiModels.findRecordAbsensiByAbsensiID(absensiID);

        const data = {
            absensi: dataPresensi,
            record: dataRecord
        }
        return data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createRecordAbsensi = async (data) => {
    try {
        const absensiID = parseInt(data.absensiID);
        const nim = data.nim;

        const checkAbsensi = await absensiModels.findAbsensiById(absensiID);
        const checkNIM = await mahasiswaModels.findMhsByNIM(nim);

        if (!checkAbsensi) {
            throw new Error('Data Not Found');
        }

        if (checkAbsensi.status !== "Dibuka") {
            throw new Error('Absensi sudah ditutup dan tidak dapat diubah');
        }

        if (!checkNIM) {
            throw new Error('Data Not Found');
        }

        const newRecord = {
            absensiID,
            mahasiswaID: checkNIM.id,
            status: data.status
        }

        const result = await recordAbsensiModels.createRecordAbsensi(newRecord);

        return result;
    } catch (error) {
        throw error;
    }
}

const recordAbsensi = async (absensiID, mhsNIM) => {
    try {
        const presensiID = parseInt(absensiID);
        const nim = parseInt(mhsNIM);

        const checkAbsensi = await absensiModels.findAbsensiById(presensiID);
        const checkNIM = await mahasiswaModels.findMhsByNIM(nim);

        if (!checkAbsensi) {
            throw new Error('Data Not Found');
        }

        if (checkAbsensi.status !== "Dibuka") {
            throw new Error('Absensi sudah ditutup dan tidak dapat diubah');
        }

        if (!checkNIM) {
            throw new Error('Data Not Found');
        }

        const pesertaPraktikum = await pesertaModels.FindPesertaPraktikumByPraktikumID(checkAbsensi.praktikum_id);
        const isMahasiswaTerdaftar = pesertaPraktikum.some(
            (peserta) => peserta.Mahasiswa.nim === nim
        );

        if (!isMahasiswaTerdaftar) {
            throw new Error('Mahasiswa tidak terdaftar pada praktikum ini');
        }

        return await recordAbsensiModels.recordAbsensi(presensiID, checkNIM.id, 'Hadir');

    } catch (error) {
        throw error;
    }
}

const checkRecordPresensi = async (absensiID, mhsID) => {
    try {
        const absenID = parseInt(absensiID);
        const mahasiswaID = parseInt(mhsID);

        const data = await recordAbsensiModels.findRecordAbsensiByAbsensiIDAndMhsID(absenID, mahasiswaID);

        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}

const updateRecordAbsensi = async (id, data) => {
    try {
        const recordID = parseInt(id);
        const result = await recordAbsensiModels.updateRecordAbsensi(recordID, data);

        return result;
    } catch (error) {
        throw error;
    }
}

const deleteRecordAbsensi = async (id) => {
    try {
        const recordID = parseInt(id);

        return await recordAbsensiModels.deleteRecordAbsensi(recordID);
    } catch (error) {
        throw error;
    }
}

const deleteRecordAbsensiByAbsensiID = async (absensiID) => {
    try {
        const recordID = parseInt(absensiID);

        return await recordAbsensiModels.deleteRecordAbsensiByAbsensiID(recordID);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findRecordAbsenByID,
    findRecordAbsenByAbsensiID,
    createRecordAbsensi,
    recordAbsensi,
    checkRecordPresensi,
    updateRecordAbsensi,
    deleteRecordAbsensi,
    deleteRecordAbsensiByAbsensiID,
};