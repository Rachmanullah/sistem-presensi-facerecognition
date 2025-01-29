'use server'
import prisma from '@/app/lib/prismaClient';
import { getRecordAbsensiByAbsensiID, updateRecordAbsensi } from '@/app/service/recordAbsensiService';

export const checkAbsensiStatus = async () => {
    try {
        const currentTime = new Date(); // Waktu lokal
        console.log(`Pengecekan absensi dijalankan pada: ${currentTime}`);

        const absensi = await prisma.absensi.findMany();
        console.log(`Ditemukan ${absensi.length} absensi untuk diperiksa.`);

        const updates = absensi.map(async (item) => {
            // Ambil start_time dan end_time sebagai waktu lokal
            const startTimeLocal = new Date(item.start_time); // Waktu mulai absensi
            const endTimeLocal = new Date(item.end_time); // Waktu akhir absensi

            console.log(`Memeriksa absensi ID ${item.id} - Status: ${item.status} - Start Time: ${startTimeLocal} - End Time: ${endTimeLocal}`);

            // Log untuk perbandingan waktu
            console.log(`Current Time: ${currentTime}, Start Time: ${startTimeLocal}, End Time: ${endTimeLocal}`);

            // Cek apakah waktu sekarang lebih besar dari start_time untuk membuka absensi
            if (currentTime >= startTimeLocal && item.status === 'Tutup') {
                console.log(`Membuka absensi ID ${item.id} - ${item.kelas}.`);
                await prisma.absensi.update({
                    where: { id: item.id },
                    data: { status: 'Dibuka' },
                });
                console.log(`Absensi ID ${item.id} berhasil dibuka.`);
            }

            // Cek apakah waktu sekarang lebih besar dari end_time untuk menutup absensi
            if (currentTime >= endTimeLocal && item.status === 'Dibuka') {
                console.log(`Menutup absensi ID ${item.id} - ${item.kelas}.`);
                await prisma.absensi.update({
                    where: { id: item.id },
                    data: { status: 'Ditutup' },
                });
                console.log(`Absensi ID ${item.id} berhasil ditutup.`);

                const praktikan = await getRecordAbsensiByAbsensiID(item.id);
                const filterPraktikan = praktikan.filter((item) => {
                    return item.status === 'Belum Absen';
                });

                await Promise.all(filterPraktikan.map(async (praktikanItem) => {
                    await updateRecordAbsensi(praktikanItem.id, { status: 'Tidak Hadir' });
                }));

                console.log(`Semua praktikan yang belum absen pada absensi ID ${item.id} telah diubah menjadi 'Tidak Hadir'.`);
            } else {
                console.log(`Absensi ID ${item.id} tetap ${item.status}.`);
            }
        });

        await Promise.all(updates);
        console.log('Pengecekan absensi selesai.');
    } catch (error) {
        console.error('Error dalam pengecekan absensi:', error);
    }
};