const { pesertaService, praktikumService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.handlerGetPesertaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await pesertaService.findPesertaByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handleGetPesertaPraktikumByPraktikumID = async (req, res) => {
    try {
        const praktikumID = parseInt(req.params.praktikumID);
        const dataPraktikum = await praktikumService.findPraktikumByID(praktikumID);

        if (!dataPraktikum) {
            return responseHandler.error('Data Not Found', 404);
        }
        const dataPeserta = await pesertaService.findPesertaByPraktikumID(praktikumID);

        const data = {
            praktikum: dataPraktikum,
            peserta: dataPeserta
        }
        return responseHandler.success(res, data, 'Get Data Success', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handlerCreatePeserta = async (req, res) => {
    try {
        const data = await pesertaService.createPeserta(req.body);
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

exports.handlerUpdatePeserta = async (req, res) => {
    try {
        const pesertaID = parseInt(req.params.pesertaID);
        const data = req.body;
        const pesertaData = await pesertaService.findPesertaByID(pesertaID);
        if (!pesertaData) return responseHandler.error(res, 'Data Not Found', 404);
        const updatedData = await pesertaService.updatePeserta(pesertaID, data);
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

exports.handlerDeletePeserta = async (req, res) => {
    try {
        const pesertaID = parseInt(req.params.pesertaID);
        const pesertaData = await pesertaService.findPesertaByID(pesertaID);
        if (!pesertaData) return responseHandler.error(res, 'Data Not Found', 404);
        await pesertaService.deletePeserta(pesertaID);
        return responseHandler.success(res, null, 'Data deleted successfully', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}