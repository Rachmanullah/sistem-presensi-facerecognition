const { mahasiswaModels, pesertaModels } = require('../model');
const { FindPraktikumByID } = require('../model/praktikumModels');
const { mahasiswaValidation, Peserta_PraktikumValidation } = require('../utils/validationHelper');

const findPesertaByID = async (ID) => {
    try {
        return await pesertaModels.FindPesertaPraktikumByID(ID)
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findPesertaByPraktikumID = async (praktikumID) => {
    try {
        return await pesertaModels.FindPesertaPraktikumByPraktikumID(praktikumID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createPeserta = async (data) => {
    try {
        if (Array.isArray(data)) {
            const results = [];
            for (const item of data) {
                const subsetValidation = Peserta_PraktikumValidation.pick(['praktikumID', 'kelas']);
                await subsetValidation.validate(item);
                const praktikumID = parseInt(item.praktikumID);
                const nimMHS = parseInt(item.nim);

                let mahasiswa = await mahasiswaModels.findMhsByNIM(nimMHS);

                // Jika mahasiswa belum ada, buat data mahasiswa baru
                if (!mahasiswa) {
                    await mahasiswaValidation.validate(item, { abortEarly: false });
                    mahasiswa = await createMhs({
                        nim: nimMHS,
                        nama: item.nama || "Tanpa Nama",
                    });
                }

                const checkPraktikum = await FindPraktikumByID(praktikumID);
                if (!checkPraktikum) {
                    throw new error('praktikum not found')
                }

                const checkPeserta = await pesertaModels.FindPesertaByPraktikumIDAndMahasiswaIDAndKelas(
                    praktikumID,
                    mahasiswa.id,
                    item.kelas
                );

                // Abaikan jika mahasiswa sudah terdaftar di praktikum dengan kelas yang sama
                if (checkPeserta) continue;

                const newPeserta = {
                    praktikumID,
                    mahasiswaID: mahasiswa.id,
                    kelas: item.kelas,
                };

                const result = await pesertaModels.createPesertaPraktikum(newPeserta);
                results.push(result);
            }
            return results;
        } else {
            // Jika data tunggal
            const subsetValidation = Peserta_PraktikumValidation.pick(['praktikumID', 'kelas']);
            await subsetValidation.validate(data);
            const praktikumID = parseInt(data.praktikumID);
            const nimMHS = parseInt(data.nim);

            let mahasiswa = await mahasiswaModels.findMhsByNIM(nimMHS);

            if (!mahasiswa) {
                await mahasiswaValidation.validate(data, { abortEarly: false });
                mahasiswa = await createMhs({
                    nim: nimMHS,
                    nama: data.nama || "Tanpa Nama",
                });
            }

            const checkPraktikum = await FindPraktikumByID(praktikumID);
            if (!checkPraktikum) {
                throw new error('praktikum not found')
            }

            const checkPeserta = await pesertaModels.FindPesertaByPraktikumIDAndMahasiswaIDAndKelas(
                praktikumID,
                mahasiswa.id,
                data.kelas
            );

            if (checkPeserta) {
                throw new error('Mahasiswa sudah terdaftar di praktikum ini pada kelas yang sama');
            }

            const newPeserta = {
                praktikumID,
                mahasiswaID: mahasiswa.id,
                kelas: data.kelas,
            };

            const result = await createPesertaPraktikum(newPeserta);
            return result;
        }
    } catch (error) {
        throw error;
    }
}

const updatePeserta = async (ID, data) => {
    try {
        await Peserta_PraktikumValidation.validateAt('kelas', data);
        return await pesertaModels.updatePesertaPraktikum(ID, data);
    } catch (error) {
        throw error;
    }
}

const deletePeserta = async (pesertaID) => {
    try {
        return await pesertaModels.destroyPesertaPraktikum(pesertaID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

const deleteDeletePesertaByPraktikumID = async (praktikumID) => {
    try {
        return await pesertaModels.destroyPesertaPraktikumByPraktikumID(praktikumID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findPesertaByID,
    findPesertaByPraktikumID,
    createPeserta,
    updatePeserta,
    deletePeserta,
    deleteDeletePesertaByPraktikumID,
};