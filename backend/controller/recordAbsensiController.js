const { recordAbsensiService } = require("../service");
const responseHandler = require("../utils/responseHandler");
exports.handleGetRecordAbsenByID = async (req, res) => {
    try {
        const dataID = parseInt(req.params.id);
        const data = await recordAbsensiService.findRecordAbsenByID(dataID);

        return responseHandler.success(res, data, 'Get Data Success', 200);
    } catch (error) {
        console.error('Error fetching data:', error);
        return responseHandler.error(res, error.message || 'Get Data failed', 401);
    }
}

exports.handleGetRecordAbsenByAbsensiID = async (req, res) => {
    try {
        const absensiID = parseInt(req.params.absensiID);
        const data = await recordAbsensiService.findRecordAbsenByAbsensiID(absensiID);

        return responseHandler.success(res, data, 'Get Data Success', 200);
    } catch (error) {
        console.error('Error fetching data:', error);
        return responseHandler.error(res, error.message || 'Get Data failed', 401);
    }
}

exports.handleCreateRecordAbsensi = async (req, res) => {
    try {
        const data = req.body;

        const recordAbsensi = await recordAbsensiService.createRecordAbsensi(data);
        return responseHandler.success(res, recordAbsensi, 'Create Data Success', 201);
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

exports.handleRecordAbsensi = async (req, res) => {
    try {
        const absensiID = parseInt(req.params.id);
        const data = req.body;

        const recordPresensi = await recordAbsensiService.recordAbsensi(absensiID, data);

        return responseHandler.success(res, recordPresensi, 'Absensi Berhasil Direkam', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handleCheckRecordAbsensi = async (req, res) => {
    try {
        const absenID = parseInt(req.params.absensiID);
        const mahasiswaID = parseInt(req.params.mhsID);

        const checkPresensi = await recordAbsensiService.checkRecordPresensi(absenID, mahasiswaID);
        return responseHandler.success(res, checkPresensi, 'Presensi Mahasiswa Ditemukan', 200);
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

exports.handleUpdateRecordAbsensi = async (req, res) => {
    try {
        const recordID = parseInt(req.params.id);
        const data = req.body;
        const result = await recordAbsensiService.updateRecordAbsensi(recordID, data);

        return responseHandler.success(res, result, 'update Data Success', 200);
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

exports.handleDeleteRecordAbsensi = async (req, res) => {
    try {
        const recordID = parseInt(req.params.id);

        await recordAbsensiService.deleteRecordAbsensi(recordID);
        return responseHandler.success(res, null, 'delete Data Success', 200);
    } catch (error) {
        console.error('Error fetching data:', error);
        return responseHandler.error(res, error.message || 'delete Data failed', 401);
    }
}

exports.handleDeleteRecordAbsensiByAbsensiID = async (req, res) => {
    try {
        const absensiID = parseInt(req.params.absensiID);

        await recordAbsensiService.deleteRecordAbsensiByAbsensiID(absensiID);
        return responseHandler.success(res, null, 'delete Data Success', 200);
    } catch (error) {
        console.error('Error fetching data:', error);
        return responseHandler.error(res, error.message || 'delete Data failed', 401);
    }
}