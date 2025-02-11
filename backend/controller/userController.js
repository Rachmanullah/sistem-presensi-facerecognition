
const { findAllUsers, findUserByID, updateUser, createUser, deleteUser, authenticateUser, updateToken, refreshToken } = require("../service/userService")
const responseHandler = require("../utils/responseHandler");

exports.HandlerGetAllUsers = async (req, res) => {
    try {
        const users = await findAllUsers();
        return responseHandler.success(res, users, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.HandlerGetuserByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await findUserByID(id);
        return responseHandler.success(res, user, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.HandlerCreateUser = async (req, res) => {
    try {
        const data = req.body;
        const user = await createUser(data);
        return responseHandler.success(res, user, 'User created successfully', 201);
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

exports.HandlerUpdateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const user = await updateUser(id, data);
        return responseHandler.success(res, user, 'User updated successfully', 200);
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

exports.HandlerDeleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await findUserByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await deleteUser(id);
        return responseHandler.success(res, null, 'User deleted successfully', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }

}

exports.HandlerAuthenticateUser = async (req, res) => {
    try {
        const data = req.body;
        const user = await authenticateUser(data);
        return responseHandler.success(res, user, 'Authentication successfully', 200);
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

exports.HandlerLogout = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await findUserByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await updateToken(id);
        return responseHandler.success(res, null, 'User deleted successfully', 200);
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

exports.HandlerLogout = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await findUserByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await refreshToken(id);
        return responseHandler.success(res, null, 'User deleted successfully', 200);
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