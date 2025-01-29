const { mahasiswaService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.handlerGetAllMhs = async (req, res) => {
    try {
        const mhs = await mahasiswaService.findAllMhs();
        return responseHandler.success(res, mhs, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerGetMhsById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await mahasiswaService.findMhsByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerGetMhsByNIM = async (req, res) => {
    try {
        const nim = parseInt(req.params.nim);
        const data = await mahasiswaService.findMhsByNIM(nim);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerCountMhs = async (req, res) => {
    try {
        const count = await mahasiswaService.countMhs();
        return responseHandler.success(res, count, 'successfully', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerCreateMhs = async (req, res) => {
    try {
        const data = await mahasiswaService.createMhs(req.body);
        return responseHandler.success(res, data, 'Data created successfully', 201);
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

exports.handlerUpdateMhs = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const mhsData = await mahasiswaService.findMhsByID(id);
        if (!mhsData) return responseHandler.error(res, 'Data Not Found', 404);
        const updatedData = await mahasiswaService.updateMhs(id, data);
        return responseHandler.success(res, updatedData, 'Data updated successfully', 200);
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

exports.handlerDeleteMhs = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const mhsData = await mahasiswaService.findMhsByID(id);
        if (!mhsData) return responseHandler.error(res, 'Data Not Found', 404);
        await mahasiswaService.deleteMhs(id);
        return responseHandler.success(res, null, 'Data deleted successfully', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}