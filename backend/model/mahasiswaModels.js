const prisma = require("../lib/prismaClient");

const findAllMhs = async () => {
    try {
        const data = await prisma.mahasiswa.findMany();
        return data;
    } catch (error) {
        throw error;
    }
};

const findMhsByID = async (id) => {
    try {
        const data = await prisma.mahasiswa.findUnique({
            where: { id },
        });
        return data;
    } catch (error) {
        throw error;
    }
}

const findMhsByNIM = async (nim) => {
    try {
        const data = await prisma.mahasiswa.findUnique({
            where: { nim: nim },
        });
        return data;
    } catch (error) {
        throw error;
    }
}

const countMhs = async () => {
    try {
        const count = await prisma.mahasiswa.count();

        return count;
    } catch (error) {
        throw error;
    }
}

const createMhs = async (data) => {
    try {
        if (Array.isArray(data)) {
            const newMhs = await prisma.mahasiswa.createMany({
                data: data.map((item) => ({
                    nim: item.nim,
                    email: item.email,
                    nama: item.nama,
                })),
                skipDuplicates: true,
            });
            return newMhs;
        }

        if (typeof data === 'object' && data !== null) {
            const newMhs = await prisma.mahasiswa.create({
                data: {
                    nim: data.nim,
                    email: data.email,
                    nama: data.nama,
                },
            });
            return newMhs;
        }

        throw new Error("Data tidak valid: Harus berupa object atau array.");
    } catch (error) {
        console.error("Error saat menambahkan mahasiswa:", error);
        throw error;
    }
};

const updateMhs = async (id, data) => {
    try {
        const updatedMhs = await prisma.mahasiswa.update({
            where: { id },
            data: {
                nim: data.nim,
                email: data.email,
                nama: data.nama,
            },
        });
        return updatedMhs;
    } catch (error) {
        throw error;
    }
}

const destroyMhs = async (id) => {
    try {
        const deletedMhs = await prisma.mahasiswa.delete({
            where: { id },
        });
        return deletedMhs;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllMhs,
    findMhsByID,
    findMhsByNIM,
    countMhs,
    createMhs,
    updateMhs,
    destroyMhs,
}