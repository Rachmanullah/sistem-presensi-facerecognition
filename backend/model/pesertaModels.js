const prisma = require('../lib/prismaClient');
const { findTahunAkademikByStatusAktif } = require('./thAkademikModels')

const FindPesertaPraktikumByID = async (id) => {
    try {
        const result = await prisma.peserta_Praktikum.findUnique({
            where: {
                id
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const FindPesertaPraktikumByPraktikumID = async (praktikumID) => {
    try {
        const result = await prisma.peserta_Praktikum.findMany({
            where: {
                praktikum_id: praktikumID
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

const FindPesertaPraktikumByPraktikumIDAndKelas = async (praktikumID, kelas) => {
    try {
        const result = await prisma.peserta_Praktikum.findMany({
            where: {
                AND: [
                    { praktikum_id: praktikumID },
                    { kelas: kelas },
                ],
            },
            include: {
                Mahasiswa: true,
            },
        });
        return result;
    } catch (error) {
        console.error('Error in FindPesertaByPraktikumIDAndKelas:', error);
        throw new Error('Gagal mendapatkan peserta praktikum');
    }
}

const FindPesertaByPraktikumIDAndMahasiswaIDAndKelas = async (praktikumID, mhsID, kelas) => {
    try {
        const result = await prisma.peserta_Praktikum.findFirst({
            where: {
                AND: [
                    { praktikum_id: praktikumID },
                    { mahasiswa_id: mhsID },
                    { kelas: kelas },
                ],
            },
            include: {
                Mahasiswa: true, // Menyertakan data mahasiswa terkait
            },
        });
        return result;
    } catch (error) {
        console.error('Error in getPesertaByPraktikumIDAndMahasiswaIDAndKelas:', error);
        throw new Error('Gagal mendapatkan peserta praktikum');
    }
};

const createPesertaPraktikum = async (data) => {
    try {
        const tahunAkademik = await findTahunAkademikByStatusAktif();
        if (Array.isArray(data)) {
            const result = await prisma.peserta_Praktikum.createMany({
                data: data.map((item) => ({
                    praktikum_id: item.praktikumID,
                    mahasiswa_id: item.mahasiswaID,
                    id_thAkademik: parseInt(tahunAkademik.id),
                    kelas: item.kelas,
                })),
                skipDuplicates: true, // Lewati jika ada data duplikat
            });
            return result;
        }

        if (typeof data === 'object' && data !== null) {
            const result = await prisma.peserta_Praktikum.create({
                data: {
                    praktikum_id: data.praktikumID,
                    mahasiswa_id: data.mahasiswaID,
                    id_thAkademik: parseInt(tahunAkademik.id),
                    kelas: data.kelas,
                },
            });
            return result;
        }

        throw new Error("Data tidak valid: Harus berupa object atau array.");
    } catch (error) {
        console.error("Error saat menambahkan peserta praktikum:", error);
        throw error;
    }
};


const updatePesertaPraktikum = async (id, data) => {
    try {
        const result = await prisma.peserta_Praktikum.update({
            where: {
                id
            },
            data: {
                kelas: data.kelas,
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const destroyPesertaPraktikum = async (id) => {
    try {
        const result = await prisma.peserta_Praktikum.delete({
            where: {
                id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const destroyPesertaPraktikumByPraktikumID = async (praktikumID) => {
    try {
        const result = await prisma.peserta_Praktikum.deleteMany({
            where: {
                praktikum_id: praktikumID
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    FindPesertaPraktikumByID,
    FindPesertaPraktikumByPraktikumID,
    FindPesertaPraktikumByPraktikumIDAndKelas,
    FindPesertaByPraktikumIDAndMahasiswaIDAndKelas,
    createPesertaPraktikum,
    updatePesertaPraktikum,
    destroyPesertaPraktikum,
    destroyPesertaPraktikumByPraktikumID,
}