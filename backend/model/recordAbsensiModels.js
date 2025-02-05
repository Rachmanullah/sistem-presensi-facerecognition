const prisma = require('../lib/prismaClient');

const findRecordAbsensiByID = async (id) => {
    try {
        const result = await prisma.record_Absensi.findUnique({
            where: {
                id
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const findRecordAbsensiByAbsensiID = async (absensiID) => {
    try {
        const result = await prisma.record_Absensi.findMany({
            where: {
                absensi_id: absensiID
            },
            include: {
                Mahasiswa: true
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const createRecordAbsensi = async (data) => {
    try {
        const result = await prisma.record_Absensi.create({
            data: {
                absensi_id: data.absensiID,
                mahasiswa_id: data.mahasiswaID,
                status: data.status,
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const updateRecordAbsensi = async (id, data) => {
    try {
        const result = await prisma.record_Absensi.update({
            where: {
                id
            },
            data: {
                status: data.status,
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const recordAbsensi = async (absensiID, mahasiwaID, status) => {
    try {
        const record = await prisma.record_Absensi.findFirst({
            where: {
                absensi_id: absensiID,
                mahasiswa_id: mahasiwaID,
            },
        });

        if (!record) {
            throw new Error('Record tidak ditemukan');
        }

        const result = await prisma.record_Absensi.update({
            where: { id: record.id },
            data: {
                status: status,
            },
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteRecordAbsensi = async (id) => {
    try {
        const result = await prisma.record_Absensi.delete({
            where: {
                id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const deleteRecordAbsensiByAbsensiID = async (absensiID) => {
    try {
        const result = await prisma.record_Absensi.deleteMany({
            where: {
                absensi_id: absensiID
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const findRecordAbsensiByAbsensiIDAndMhsID = async (absensiID, mhsID) => {
    try {
        const result = await prisma.record_Absensi.findFirst({
            where: {
                AND: [
                    { absensi_id: absensiID },
                    { mahasiswa_id: mhsID },
                    { status: 'Hadir' },
                ],
            },
            include: {
                Mahasiswa: true, // Menyertakan data mahasiswa terkait
            },
        });
        return result;
    } catch (error) {
        console.error('Error in :', error);
        throw new Error('Gagal mendapatkan data');
    }
}

module.exports = {
    findRecordAbsensiByID,
    findRecordAbsensiByAbsensiID,
    createRecordAbsensi,
    updateRecordAbsensi,
    recordAbsensi,
    deleteRecordAbsensi,
    deleteRecordAbsensiByAbsensiID,
    findRecordAbsensiByAbsensiIDAndMhsID,
}