const { praktikumModels, pesertaModels } = require('../model');
const { praktikumValidation } = require('../utils/validationHelper');

const findAllPraktikum = async () => {
    try {
        return await praktikumModels.findAllPraktikum();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findPraktikumByID = async (praktikumID) => {
    try {
        return await praktikumModels.FindPraktikumByID(praktikumID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findPraktikumByLaboratoriumID = async (labID) => {
    try {
        return await praktikumModels.FindPraktikumByLaboratoriumID(labID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const countPraktikum = async () => {
    try {
        return await praktikumModels.countPraktikum();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createPraktikum = async (praktikumData) => {
    try {
        await praktikumValidation.validate(praktikumData, { abortEarly: false });
        return await praktikumModels.createPraktikum(praktikumData);
    } catch (error) {
        throw error;
    }
}

const updatePraktikum = async (praktikumID, praktikumData) => {
    try {
        await praktikumValidation.validate(praktikumData, { abortEarly: false });
        return await praktikumModels.updatePraktikum(praktikumID, praktikumData);
    } catch (error) {
        throw error;
    }
}

const deletePraktikum = async (praktikumID) => {
    try {
        await pesertaModels.destroyPesertaPraktikumByPraktikumID(praktikumID);
        return await praktikumModels.destroyPraktikum(praktikumID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

const deletePraktikumByLabID = async (labID) => {
    try {
        const praktikumData = await praktikumModels.FindPraktikumByLaboratoriumID(labID);
        await pesertaModels.destroyPesertaPraktikumByPraktikumID(praktikumData.id);
        return await praktikumModels.destroyPraktikumByLabID(labID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findAllPraktikum,
    findPraktikumByID,
    createPraktikum,
    updatePraktikum,
    deletePraktikum,
    countPraktikum,
    findPraktikumByLaboratoriumID,
    deletePraktikumByLabID
}