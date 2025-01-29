const prisma = require('../lib/prismaClient');

const findAllLaboratorium = async () => {
    try {
        const laboratorium = await prisma.laboratorium.findMany();
        return laboratorium;
    } catch (error) {
        throw error;
    }
}

const findLaboratoriumByID = async (id) => {
    try {
        const lab = await prisma.laboratorium.findUnique({
            where: {
                id
            }
        });
        return lab;
    } catch (error) {
        throw error;
    }
}

const countLaboratorium = async () => {
    try {
        const count = await prisma.laboratorium.count();

        return count;
    } catch (error) {
        throw error;
    }
}

const createLaboratorium = async (data) => {
    try {
        const lab = await prisma.laboratorium.create({
            data: {
                nama: data.nama
            }
        });
        return lab;
    } catch (error) {
        throw error;
    }
}

const updateLaboratorium = async (id, data) => {
    try {
        const lab = await prisma.laboratorium.update({
            where: { id },
            data: { nama: data.nama },
        });
        return lab;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

const destroyLaboratorium = async (id) => {
    try {
        const lab = await prisma.laboratorium.delete({
            where: { id: id }
        });
        return lab;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

module.exports = {
    findAllLaboratorium,
    findLaboratoriumByID,
    countLaboratorium,
    createLaboratorium,
    updateLaboratorium,
    destroyLaboratorium,
}