import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, fileName) => {
    const sortDataById = (data) => {
        return data.sort((a, b) => a.id - b.id);
    };
    const sortingData = sortDataById(data); // Urutkan data berdasarkan id
    const ws = XLSX.utils.json_to_sheet(sortingData); // Konversi ke worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `${fileName}.xlsx`);
};

export const exportLaporanToExcel = (data) => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = data.map(item => {
        const record = { NIM: item.nim, Nama: item.nama };
        item.pertemuan.forEach((pertemuan, index) => {
            record[`Pertemuan ${index + 1}`] = pertemuan.status;
        });
        return record;
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");
    XLSX.writeFile(workbook, "Laporan_Absensi.xlsx");
};