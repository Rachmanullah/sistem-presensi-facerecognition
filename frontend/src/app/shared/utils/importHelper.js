import * as XLSX from "xlsx";

export const importFromExcel = (file, setData) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Konversi ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validasi data JSON
        const validData = jsonData.map((item) => {
            if (!item.nim || !item.nama || !item.kelas) {
                console.warn("Data tidak valid:", item);
                return null; // Abaikan data tidak valid
            }
            return item;
        }).filter(Boolean); // Hanya data valid

        setData(validData);
    };
    reader.readAsBinaryString(file);
};