const prisma = require("../lib/prismaClient");

const findAllTahunAkademik = async () => {
    try {
        const thAkademik = await prisma.tahun_akademik.findMany();
        return thAkademik;
    } catch (error) {
        throw error;
    }
}

const findTahunAkademikByStatusAktif = async () => {
    try {
        const thAkademik = await prisma.tahun_akademik.findFirst({
            where: {
                status: 'Aktif',
            }
        });

        return thAkademik;
    } catch (error) {
        throw error;
    }
}

const findTahunAkademikById = async (id) => {
    try {
        const thAkademik = await prisma.tahun_akademik.findUnique({
            where: {
                id
            }
        });
        return thAkademik;
    } catch (error) {
        throw error;
    }
}

const createTahunAkademik = async (data) => {
    try {
        const lab = await prisma.tahun_akademik.create({
            data: data
        });
        return lab;
    } catch (error) {
        throw error;
    }
}

const updateTahunAkademik = async (id, data) => {
    try {
        const lab = await prisma.tahun_akademik.update({
            where: { id },
            data: data,
        });
        return lab;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

const destroyTahunAkademik = async (id) => {
    try {
        const lab = await prisma.tahun_akademik.delete({
            where: { id }
        });
        return lab;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

module.exports = {
    findAllTahunAkademik,
    findTahunAkademikByStatusAktif,
    findTahunAkademikById,
    createTahunAkademik,
    updateTahunAkademik,
    destroyTahunAkademik,
}