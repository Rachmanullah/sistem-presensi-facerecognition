const { laboratoriumService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.handlerGetAllLaboratorium = async (req, res) => {
    try {
        const laboratorium = await laboratoriumService.findAllLaboratorium();
        return responseHandler.success(res, laboratorium, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerGetLaboratoriumByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const laboratorium = await laboratoriumService.findLaboratoriumByID(id);
        return responseHandler.success(res, laboratorium, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerCountLaboratorium = async (req, res) => {
    try {
        const count = await laboratoriumService.countLaboratorium();
        return responseHandler.success(res, count, 'successfully', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.HandlerCreateLaboratorium = async (req, res) => {
    try {
        const data = req.body;
        const laboratorium = await laboratoriumService.createLaboratorium(data);
        return responseHandler.success(res, laboratorium, 'laboratorium created successfully', 201);
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

exports.handlerUpdateLaboratorium = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const laboratorium = await laboratoriumService.updateLaboratorium(id, data);
        return responseHandler.success(res, laboratorium, 'laboratorium updated successfully', 200);
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

exports.handlerDeleteLaboratorium = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await laboratoriumService.findLaboratoriumByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await laboratoriumService.deleteLaboratorium(id);
        return responseHandler.success(res, null, 'laboratorium deleted successfully', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}