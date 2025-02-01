const { mahasiswaModels, imageFaceModels } = require("../model");

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

        for (const file of files) {
            const imageUrl = `/public/images/${file.filename}`;

            const data = {
                mahasiswa_id: mahasiswa.id,
                image_url: imageUrl,
                image_face: file.filename,
                embedding: embeddingData
            }

            const imageFace = await imageFaceModels.createImageFace(data)

            imageFaceRecords.push(imageFace);
        }

        return imageFaceRecords;
    } catch (error) {
        throw error;
    }
}