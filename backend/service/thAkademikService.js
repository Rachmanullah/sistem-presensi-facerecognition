const { thAkademikModels } = require('../model');
const { thAkademikValidation } = require('../utils/validationHelper');

const findAllThAkademik = async () => {
    try {
        return await thAkademikModels.findAllTahunAkademik();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findThAkademikById = async (id) => {
    try {
        return await thAkademikModels.findTahunAkademikById(id);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createThAkademik = async (data) => {
    try {
        await thAkademikValidation.validate(data, { abortEarly: false });
        return await thAkademikModels.createTahunAkademik(data);
    } catch (error) {
        throw error;
    }
}

const updateThAkademik = async (id, data) => {
    try {
        await thAkademikValidation.validate(data, { abortEarly: false });
        return await thAkademikModels.updateTahunAkademik(id, data);
    } catch (error) {
        throw error;
    }
}

const deleteThAkademik = async (id) => {
    try {
        return await thAkademikModels.destroyTahunAkademik(id);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findAllThAkademik,
    findThAkademikById,
    createThAkademik,
    updateThAkademik,
    deleteThAkademik,
};