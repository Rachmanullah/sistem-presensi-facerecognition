const { userModels } = require('../model');
const { updateTokenUser } = require('../model/userModels');
const { userValidation } = require('../utils/validationHelper');
const jwt = require("jsonwebtoken");

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

const authenticateUser = async (data) => {
    try {
        const subsetValidation = userValidation.pick(['username', 'password']);
        await subsetValidation.validate(data, { abortEarly: false });

        const username = data.username;
        const password = data.password;
        const userData = await userModels.authenticateUser(username, password);

        console.log(userData);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam
        const tokenPayload = {
            userId: userData.id,
            username: userData.username,
            role: userData.role,
            expiresAt,
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { algorithm: 'HS256' }
        );

        await userModels.updateTokenUser(userData.id, token);

        const dataAuth = {
            ...userData,
            token
        }

        return dataAuth;
    } catch (error) {
        throw error;
    }
}

const refreshToken = async (userID) => {
    try {
        return await updateTokenUser(userID, '');
    } catch (error) {
        throw error;
    }
}
module.exports = {
    findAllUsers,
    findUserByID,
    createUser,
    updateUser,
    deleteUser,
    authenticateUser,
    refreshToken
}