const { thAkademikService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.HandlerGetAllThAkademik = async (req, res) => {
    try {
        const thAkademik = await thAkademikService.findAllThAkademik();
        return responseHandler.success(res, thAkademik, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.HandlerGetThAkademikByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const thAkademik = await thAkademikService.findThAkademikById(id);
        return responseHandler.success(res, thAkademik, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.HandlerCreateThAkademik = async (req, res) => {
    try {
        const data = req.body;
        const thAkademik = await thAkademikService.createThAkademik(data);
        return responseHandler.success(res, thAkademik, 'created successfully', 201);
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

exports.HandlerUpdateThAkademik = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const thAkademik = await thAkademikService.updateThAkademik(id, data);
        return responseHandler.success(res, thAkademik, 'updated successfully', 200);
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

exports.HandlerDeleteThAkademik = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await thAkademikService.findThAkademikById(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await thAkademikService.deleteThAkademik(id);
        return responseHandler.success(res, null, 'deleted successfully', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}