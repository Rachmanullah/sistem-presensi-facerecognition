"use client"
// components/AbsensiChecker.js
import { useEffect } from 'react';
import apiClient from '@/app/lib/apiClient';

const AbsensiChecker = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            console.log('Memulai pengecekan absensi...');
            try {
                const response = await apiClient.get('/checkAbsensi');
                console.log('check :', response)
                if (response.status === 200) {
                    console.log('Pengecekan absensi selesai.');
                } else {
                    console.error('Terjadi kesalahan dalam pengecekan absensi.', response);
                }
            } catch (error) {
                console.error('Error dalam pengecekan absensi:', error);
            }
        }, 30000); // Periksa setiap 30 detik

        return () => {
            console.log('Menghentikan pengecekan absensi...');
            clearInterval(interval); // Bersihkan interval saat komponen unmount
        };
    }, []);

    return null; // Komponen ini tidak perlu render apa-apa
};

export default AbsensiChecker;
