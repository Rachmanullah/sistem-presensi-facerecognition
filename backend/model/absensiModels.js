const prisma = require('../lib/prismaClient');
const { findTahunAkademikByStatusAktif } = require('./thAkademikModels')

const findAllAbsensi = async () => {
    try {
        const absensi = await prisma.absensi.findMany({
            include: {
                Praktikum: {
                    select: {
                        nama: true
                    }
                },
                tahun_akademik: {
                    select: {
                        tahun: true
                    }
                }
            }
        });
        return absensi;
    } catch (error) {
        throw error;
    }
}

const findAbsensiById = async (id) => {
    try {
        const absensi = await prisma.absensi.findUnique({
            where: {
                id
            },
            include: {
                Praktikum: {
                    select: {
                        nama: true
                    }
                },
                tahun_akademik: {
                    select: {
                        tahun: true
                    }
                }
            }
        });
        return absensi;
    } catch (error) {
        throw error;
    }
}

const findAbsensiByPraktikumIDandKelasAndPertemuan = async (praktikumID, kelas, pertemuan) => {
    try {
        const absensi = await prisma.absensi.findMany({
            where: {
                AND: [
                    { praktikum_id: praktikumID },
                    { kelas: kelas },
                    { pertemuan: pertemuan }
                ],
            },
            include: {
                Praktikum: {
                    select: {
                        nama: true
                    }
                },
                tahun_akademik: {
                    select: {
                        tahun: true
                    }
                }
            }
        });
        return absensi;
    } catch (error) {
        throw error;
    }
}

const findAbsensiByPraktikumID = async (praktikumID) => {
    try {
        const absensi = await prisma.absensi.findMany({
            where: {
                praktikum_id: praktikumID,  // Filter berdasarkan praktikum_id
            },
            include: {
                Praktikum: {
                    select: {
                        nama: true, // Ambil nama praktikum
                    },
                },
                tahun_akademik: {
                    select: {
                        tahun: true
                    }
                },
                record_Abensi: {
                    include: {
                        Mahasiswa: {
                            select: {
                                nim: true,     // Ambil NIM mahasiswa
                                nama: true,    // Ambil nama mahasiswa
                            },
                        },
                    },
                },
            },
        });
        return absensi;  // Mengembalikan data absensi yang sudah lengkap
    } catch (error) {
        throw error;
    }
}

const createAbsensi = async (data) => {
    try {
        const tahunAkademik = await findTahunAkademikByStatusAktif();
        const absensi = await prisma.absensi.create({
            data: {
                praktikum_id: parseInt(data.praktikum_id),
                id_thAkademik: parseInt(tahunAkademik.id),
                kelas: data.kelas,
                tanggal: data.tanggal,
                pertemuan: parseInt(data.pertemuan),
                start_time: data.start_time,
                end_time: data.end_time,
                durasi: parseInt(data.durasi),
                status: data.status,
            }
        });
        return absensi;
    } catch (error) {
        throw error;
    }
}

const updateAbsensi = async (id, data) => {
    try {
        const absensi = await prisma.absensi.update({
            where: { id },
            data: {
                praktikum_id: parseInt(data.praktikum_id),
                kelas: data.kelas,
                tanggal: data.tanggal,
                pertemuan: parseInt(data.pertemuan),
                start_time: data.start_time,
                end_time: data.end_time,
                durasi: parseInt(data.durasi),
                status: data.status,
            },
        });
        return absensi;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

const destroyAbsensi = async (id) => {
    try {
        const absensi = await prisma.absensi.delete({
            where: { id }
        });
        return absensi;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

module.exports = {
    findAllAbsensi,
    findAbsensiById,
    findAbsensiByPraktikumIDandKelasAndPertemuan,
    findAbsensiByPraktikumID,
    createAbsensi,
    updateAbsensi,
    destroyAbsensi,
}