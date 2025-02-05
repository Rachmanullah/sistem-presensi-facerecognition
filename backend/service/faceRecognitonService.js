const { mahasiswaModels, imageFaceModels } = require("../model");

// Fungsi menghitung Euclidean Distance
const calculateEuclideanDistance = (vector1, vector2) => {
    if (vector1.length !== vector2.length) {
        throw new Error('Dimensi embedding tidak cocok.');
    }

    return Math.sqrt(
        vector1.reduce((sum, val, index) => sum + Math.pow(val - vector2[index], 2), 0)
    );
};

exports.register = async (nim, embeddings, files) => {
    try {
        const mahasiswa = await mahasiswaModels.findMhsByNIM(nim);
        if (!mahasiswa) {
            throw new Error("Mahasiswa tidak ditemukan!");
        }

        const embeddingData = embeddings;
        if (embeddingData.length !== files.length) {
            throw new Error("Jumlah embeddings tidak sesuai dengan jumlah gambar!");
        }

        const imageFaceRecords = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imageUrl = `/public/images/${file.filename}`;
            const embedding = embeddings[i]; // Ambil embedding yang sesuai dengan file ke-i

            const data = {
                mahasiswa_id: mahasiswa.id,
                image_url: imageUrl,
                image_face: file.filename,
                embedding: embedding  // Simpan hanya embedding yang sesuai
            };

            const imageFace = await imageFaceModels.createImageFace(data);
            imageFaceRecords.push(imageFace);
        }

        return imageFaceRecords;
    } catch (error) {
        throw error;
    }
}

exports.predictEmbedding = async (mhsID, targetEmbedding) => {
    try {
        const embeddings = await imageFaceModels.findEmbeddingFaceByMahasiswaID(mhsID);

        if (!embeddings || embeddings.length === 0) {
            throw new Error(`Tidak ada embedding yang ditemukan.`);
        }

        // Debug: Periksa bentuk embedding yang diterima
        console.log('[PredictEmbedding] Raw embeddings:', embeddings);

        // Konversi embedding (cek apakah perlu JSON.parse)
        const parsedEmbeddings = embeddings.map((item) => {
            if (typeof item.embedding === 'string') {
                // Jika embedding adalah string, lakukan JSON.parse
                try {
                    return { id: item.id, embedding: JSON.parse(item.embedding) };
                } catch (err) {
                    console.error('[PredictEmbedding] Error parsing JSON:', item.embedding, err.message);
                    throw new Error(`Gagal memparsing embedding: ${err.message}`);
                }
            } else if (Array.isArray(item.embedding)) {
                // Jika sudah array, langsung gunakan
                return { id: item.id, embedding: item.embedding };
            } else {
                throw new Error(`Format embedding tidak valid: ${item.embedding}`);
            }
        });

        console.log('[PredictEmbedding] Parsed embeddings:', parsedEmbeddings);

        // Hitung Euclidean Distance untuk setiap embedding
        const distances = parsedEmbeddings.map((storedEmbedding) => {
            const distance = calculateEuclideanDistance(storedEmbedding.embedding, targetEmbedding);
            return { id: storedEmbedding.id, distance };
        });

        // Cari embedding dengan jarak terdekat
        distances.sort((a, b) => a.distance - b.distance);
        const closestMatch = distances[0];

        const isMatch = closestMatch.distance < 0.6;

        return {
            isMatch,
            closestDistance: closestMatch.distance,
            matchedRecordID: isMatch ? closestMatch.id : null
        };
    } catch (error) {
        console.error('[PredictEmbedding] Error:', error.message);
        throw error;
    }
};

exports.CountImagesFace = async () => {
    try {
        const count = await imageFaceModels.countImageFace();

        return count;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

exports.findImagesByMhsID = async (mhsID) => {
    try {
        const images = await imageFaceModels.findImageFaceByMahasiswaID(mhsID);

        return images;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}