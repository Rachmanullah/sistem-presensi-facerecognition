const { userModels } = require('../model');
const { userValidation } = require('../utils/validationHelper');

const findAllUsers = async () => {
    try {
        return await userModels.findAllUser();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findUserByID = async (userID) => {
    try {
        const user = await userModels.findUserByID(userID);
        return user;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createUser = async (userData) => {
    try {
        await userValidation.validate(userData, { abortEarly: false });

        return await userModels.createUser(userData);
    } catch (error) {
        throw error;
    }
}

const updateUser = async (userID, userData) => {
    try {
        await userValidation.validate(userData, { abortEarly: false });
        return await userModels.updateUser(userID, userData);
    } catch (error) {
        throw error;
    }
}

const deleteUser = async (userID) => {
    try {
        return await userModels.destroyUser(userID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

module.exports = {
    findAllUsers,
    findUserByID,
    createUser,
    updateUser,
    deleteUser,
}