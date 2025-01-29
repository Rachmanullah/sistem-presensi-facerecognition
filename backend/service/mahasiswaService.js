const { mahasiswaModels, pesertaModels } = require('../model');
const { mahasiswaValidation, mahasiswaValidationArray } = require('../utils/validationHelper');

const findAllMhs = async () => {
    try {
        return await mahasiswaModels.findAllMhs();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findMhsByID = async (mhsID) => {
    try {
        return await mahasiswaModels.findMhsByID(mhsID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findMhsByNIM = async (mhsNIM) => {
    try {
        return await mahasiswaModels.findMhsByNIM(mhsNIM);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const countMhs = async () => {
    try {
        return await mahasiswaModels.countMhs();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createMhs = async (data) => {
    try {
        if (Array.isArray(data)) {
            // Proses data array
            await mahasiswaValidationArray.validate(data, { abortEarly: false });
            const processedData = data.map((item) => ({
                nim: parseInt(item.nim),
                email: item.email || null,
                nama: item.nama || "Tanpa Nama",
            }));

            const newMhs = await mahasiswaModels.createMhs(processedData);
            return newMhs;
        } else {
            await mahasiswaValidation.validate(data, { abortEarly: false });
            const newData = {
                ...data,
                nim: parseInt(data.nim)
            }
            const newMhs = await mahasiswaModels.createMhs(newData);
            return newMhs;
        }
    } catch (error) {
        throw error;
    }
}

const updateMhs = async (mhsID, data) => {
    try {
        await mahasiswaValidation.validate(data, { abortEarly: false });
        const newData = {
            ...data,
            nim: parseInt(data.nim)
        }
        const updatedMhs = await mahasiswaModels.updateMhs(mhsID, newData);
        return updatedMhs;
    } catch (error) {
        throw error;
    }
}

const deleteMhs = async (mhsID) => {
    try {
        const checkPeserta = await pesertaModels.FindPesertaPraktikumByMhsID(mhsID);
        if (checkPeserta) await pesertaModels.destroyPesertaPraktikumByMhsID(mhsID);
        return await mahasiswaModels.destroyMhs(mhsID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findAllMhs,
    findMhsByID,
    findMhsByNIM,
    countMhs,
    createMhs,
    updateMhs,
    deleteMhs,
};