const { faceRecognitionService } = require("../service");
const responseHandler = require("../utils/responseHandler");

exports.handleRegister = async (req, res) => {
    try {
        console.log("Raw embedding data:", req.body.embedding);
        let embeddings = [];
        const nim = parseInt(req.body.nim);

        if (req.body.embedding) {
            try {
                embeddings = JSON.parse(req.body.embedding);
            } catch (error) {
                console.error("Error parsing embeddings:", error);
                return responseHandler.error(res, "Format embeddings tidak valid", 400);
            }
        }
        const files = req.files; // Menggunakan req.files

        console.log("NIM:", nim);
        console.log("Embeddings:", embeddings);
        console.log("Uploaded Files:", files);

        const result = await faceRecognitionService.register(nim, embeddings, files);
        return responseHandler.success(res, null, "berhasil", 200);
    } catch (error) {
        console.error("Error:", error);
        return responseHandler.error(res, error.message, 400);
    }
}