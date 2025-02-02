const { faceRecognitionService, mahasiswaService } = require("../service");
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

exports.handlePredictFace = async (req, res) => {
    try {
        const { nim, embedding } = req.body;
        if (!nim || !embedding) {
            return responseHandler.error(res, "NIM dan Embedding wajib diisi", 400);
        }

        const mahasiswa = await mahasiswaService.findMhsByNIM(parseInt(nim));

        if (!mahasiswa) {
            return responseHandler.error(res, "Mahasiswa dengan NIM tersebut tidak ditemukan", 404);
        }
        console.log('[PredictFace] Request received:', { nim, embedding: embedding.slice(0, 10) + '...' });
        console.log('[PredictFace] Mahasiswa ditemukan:', mahasiswa);

        const predictionResult = await faceRecognitionService.predictEmbedding(mahasiswa.id, embedding);

        return responseHandler.success(res, predictionResult, predictionResult.message, 200);
    } catch (error) {
        console.error("Error:", error);
        return responseHandler.error(res, error.message, 400);
    }
}

exports.handleCountImagesFace = async (req, res) => {
    try {
        const result = await faceRecognitionService.CountImagesFace();
        return responseHandler.success(res, result, "berhasil mengambil data", 200);
    } catch (error) {
        console.error("Error:", error);
        return responseHandler.error(res, error.message, 400);
    }
}

exports.handleGetImagesByMhsID = async (req, res) => {
    try {
        console.log(req.params.mhsID)
        const mhsID = parseInt(req.params.mhsID);

        const mhs = await mahasiswaService.findMhsByID(mhsID);

        if (!mhs) {
            return responseHandler.error("Mahasiswa tidak ditemukan.", 404);
        }
        const images = await faceRecognitionService.findImagesByMhsID(mhsID);

        if (!images || images.length === 0) {
            return responseHandler.error("Tidak ada gambar yang terkait dengan mahasiswa ini.", 404);
        }

        // Bangun URL untuk setiap gambar
        const result = images.map((image) => {
            // URL gambar menggunakan alamat http://localhost:2000
            const imageUrl = `http://localhost:2000/public/imagesFace/${image.image_face}`;
            return {
                id: image.id,
                mahasiswa_id: image.mahasiswa_id,
                timestamp: image.timestamp,
                imageUrl, // URL gambar lengkap
            };
        });

        // Gabungkan data mahasiswa dengan gambar
        const data = {
            ...mhs,
            images: result, // Tambahkan array gambar
        };

        return responseHandler.success(res, data, "berhasil mengambil data", 200);
    } catch (error) {
        console.error("Error:", error);
        return responseHandler.error(res, error.message, 400);
    }
}