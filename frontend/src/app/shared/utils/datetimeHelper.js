import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

// Zona waktu lokal yang digunakan
const TIMEZONE = 'Asia/Jakarta';

export const formatTanggal = (dateString) => {
    // Konversi waktu UTC ke waktu lokal
    const zonedDate = toZonedTime(new Date(dateString), TIMEZONE);

    // Format tanggal (contoh: "20 Januari 2025")
    return format(zonedDate, 'd MMMM yyyy', { locale: id });
};

export const formatWaktu = (dateString) => {
    // Konversi waktu UTC ke waktu lokal
    const zonedDate = toZonedTime(new Date(dateString), TIMEZONE);

    // Format waktu (contoh: "15:35")
    return format(zonedDate, 'HH:mm', { locale: id });
};
