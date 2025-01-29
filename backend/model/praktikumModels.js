const prisma = require('../lib/prismaClient');

const findAllPraktikum = async () => {
    try {
        const data = await prisma.praktikum.findMany({
            include: {
                Laboratorium: true,
            },
        });
        return data;
    } catch (error) {
        throw error;
    }
};

const FindPraktikumByID = async (id) => {
    try {
        const data = await prisma.praktikum.findUnique({
            where: { id },
        });
        return data;
    } catch (error) {
        throw error;
    }
}

const FindPraktikumByLaboratoriumID = async (labID) => {
    try {
        const data = await prisma.praktikum.findMany({
            where: { lab_id: labID },
        });
        return data;
    } catch (error) {
        throw error;
    }
}

const countPraktikum = async () => {
    try {
        const count = await prisma.praktikum.count();

        return count;
    } catch (error) {
        throw error;
    }
}

const createPraktikum = async (data) => {
    try {
        const newPraktikum = await prisma.praktikum.create({
            data: {
                nama: data.nama,
                periode: data.periode,
                lab_id: parseInt(data.lab_id)
            },
        });
        return newPraktikum;
    } catch (error) {
        throw error;
    }
};

const updatePraktikum = async (id, data) => {
    try {
        const updatedPraktikum = await prisma.praktikum.update({
            where: { id },
            data: {
                nama: data.nama,
                periode: data.periode,
                lab_id: parseInt(data.lab_id)
            },
        });
        return updatedPraktikum;
    } catch (error) {
        throw error;
    }
}

const destroyPraktikum = async (id) => {
    try {
        const deletedPraktikum = await prisma.praktikum.delete({
            where: { id },
        });
        return deletedPraktikum;
    } catch (error) {
        throw error;
    }
}

const destroyPraktikumByLabID = async (labID) => {
    try {
        const deletedPraktikum = await prisma.praktikum.deleteMany({
            where: { lab_id: labID },
        });
        return deletedPraktikum;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllPraktikum,
    FindPraktikumByID,
    FindPraktikumByLaboratoriumID,
    countPraktikum,
    createPraktikum,
    updatePraktikum,
    destroyPraktikum,
    destroyPraktikumByLabID
}