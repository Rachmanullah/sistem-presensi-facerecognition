const prisma = require('../lib/prismaClient');

const findImageFace = async () => {
    try {
        const imageFace = await prisma.imageFace.findMany();
        return imageFace;
    } catch (error) {
        throw error;
    }
}

const findImageFaceByMahasiswaID = async (mahasiswaID) => {
    try {
        const imageFace = await prisma.imageFace.findMany({
            where: {
                mahasiswa_id: mahasiswaID,
            }
        });

        return imageFace;
    } catch (error) {
        throw error;
    }
}

const findEmbeddingFaceByMahasiswaID = async (mahasiswaID) => {
    try {
        const imageFace = await prisma.imageFace.findMany({
            where: {
                mahasiswa_id: mahasiswaID,
            },
            select: {
                id: true,
                embedding: true
            }
        });

        return imageFace;
    } catch (error) {
        throw error;
    }
}

const countImageFace = async () => {
    try {
        const count = await prisma.imageFace.count();

        return count;
    } catch (error) {
        throw error;
    }
}

const createImageFace = async (data) => {
    try {
        const imageFace = await prisma.imageFace.create({
            data: {
                mahasiswa_id: data.mahasiswa_id,
                image_url: data.image_url,
                image_face: data.image_face,
                embedding: data.embedding,
                timestamp: new Date(),
            }
        });
        return imageFace;
    } catch (error) {
        throw error;
    }
}

const deleteImageFaceByID = async (id) => {
    try {
        const imageFace = await prisma.imageFace.delete({
            where: {
                id: id,
            }
        })

        return imageFace;
    } catch (error) {
        throw error;
    }
}

const deleteImageFaceByMahasiswaID = async (mahasiswaID) => {
    try {
        const imageFace = await prisma.imageFace.deleteMany({
            where: {
                mahasiswa_id: mahasiswaID,
            }
        });

        return imageFace;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findImageFace,
    findImageFaceByMahasiswaID,
    countImageFace,
    createImageFace,
    deleteImageFaceByID,
    deleteImageFaceByMahasiswaID,
    findEmbeddingFaceByMahasiswaID
}