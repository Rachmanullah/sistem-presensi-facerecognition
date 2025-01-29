const { laboratoriumModels } = require('../model');
const { laboratoriumValidation } = require('../utils/validationHelper');

const findAllLaboratorium = async () => {
    try {
        return await laboratoriumModels.findAllLaboratorium();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findLaboratoriumByID = async (labID) => {
    try {
        return await laboratoriumModels.findLaboratoriumByID(labID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const countLaboratorium = async () => {
    try {
        return await laboratoriumModels.countLaboratorium();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createLaboratorium = async (laboratoriumData) => {
    try {
        await laboratoriumValidation.validate(laboratoriumData, { abortEarly: false });
        return await laboratoriumModels.createLaboratorium(laboratoriumData);
    } catch (error) {
        throw error;
    }
}

const updateLaboratorium = async (labID, laboratoriumData) => {
    try {
        await laboratoriumValidation.validate(laboratoriumData, { abortEarly: false });
        return await laboratoriumModels.updateLaboratorium(labID, laboratoriumData);
    } catch (error) {
        throw error;
    }
}

const deleteLaboratorium = async (labID) => {
    try {
        return await laboratoriumModels.destroyLaboratorium(labID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findAllLaboratorium,
    findLaboratoriumByID,
    countLaboratorium,
    createLaboratorium,
    updateLaboratorium,
    deleteLaboratorium,
}