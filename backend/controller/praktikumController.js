const { praktikumService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.handlerGetAllPraktikum = async (req, res) => {
    try {
        const praktikum = await praktikumService.findAllPraktikum();
        return responseHandler.success(res, praktikum, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerGetPraktikumByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const praktikum = await praktikumService.findPraktikumByID(id);
        return responseHandler.success(res, praktikum, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerCountPraktikum = async (req, res) => {
    try {
        const count = await praktikumService.countPraktikum();
        return responseHandler.success(res, count, 'successfully', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.HandlerCreatePraktikum = async (req, res) => {
    try {
        const data = req.body;
        const praktikum = await praktikumService.createPraktikum(data);
        return responseHandler.success(res, praktikum, 'praktikum created successfully', 201);
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

exports.handlerUpdatePraktikum = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const praktikum = await praktikumService.updatePraktikum(id, data);
        return responseHandler.success(res, praktikum, 'praktikum updated successfully', 200);
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

exports.handlerDeletePraktikum = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await praktikumService.findPraktikumByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await praktikumService.deletePraktikum(id);
        return responseHandler.success(res, null, 'laboratorium deleted successfully', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}