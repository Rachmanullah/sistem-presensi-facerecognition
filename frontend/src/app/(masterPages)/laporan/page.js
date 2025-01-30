'use client'
import useForm from "@/app/hooks/useForm";
import apiClient from "@/app/lib/apiClient";
import { exportLaporanToExcel } from "@/app/shared/utils/exportHelper";
import { useState, useEffect } from "react"
import Swal from "sweetalert2";
export default function LaporanPage() {
    const [praktikum, setPraktikum] = useState([]);
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        praktikum_id: 0,
        // tanggal_mulai: "",
        // tanggal_selesai: "",
    });

    const fetchDataPraktikum = async () => {
        try {
            await apiClient.get('/praktikum', { cache: 'force-cache' })
                .then((res) => {
                    setPraktikum(res.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchDataPraktikum();
    }, []);

    const formatDataForExport = (data) => {
        const groupedData = [];

        data.forEach(item => {
            item.record_Abensi.forEach(record => {
                const mahasiswa = groupedData.find(m => m.nim === record.Mahasiswa.nim);

                if (!mahasiswa) {
                    groupedData.push({
                        nim: record.Mahasiswa.nim,
                        nama: record.Mahasiswa.nama,
                        pertemuan: [
                            { pertemuan: item.pertemuan, status: record.status }
                        ]
                    });
                } else {
                    mahasiswa.pertemuan.push({ pertemuan: item.pertemuan, status: record.status });
                }
            });
        });

        return groupedData;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.get(`/absensi/praktikum/${formData.praktikum_id}`);
            console.log(response.data.data);
            const formattedData = formatDataForExport(response.data.data);
            Swal.fire({
                title: 'Success',
                text: 'Laporan absensi berhasil dikirim',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            exportLaporanToExcel(formattedData);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response.data.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
    return (
        <div className="p-4" >
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan Absensi Praktikum</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Cetak laporan absensi berdasarkan praktikum yang diinginkan</p>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                        <form>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="praktikum" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Pilih Praktikum</label>
                                    <select value={formData.praktikum_id || ''} onChange={handleInputChange} id="praktikum_id" name="praktikum_id" className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                        <option value="" hidden>Pilih praktikum</option>
                                        {praktikum.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div>
                                    <label htmlFor="tanggal_mulai" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tanggal Mulai</label>
                                    <input value={formData.tanggal_mulai} onChange={handleInputChange} type="date" id="tanggal_mulai" name="tanggal_mulai" className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="tanggal_selesai" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tanggal Selesai</label>
                                    <input value={formData.tanggal_selesai} onChange={handleInputChange} type="date" id="tanggal_selesai" name="tanggal_selesai" className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div> */}
                                <div className="flex justify-end">
                                    <button type="button" onClick={handleSubmit} className="w-full sm:w-auto mt-4 py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md">
                                        Cetak Laporan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">* Pilih praktikum dan rentang tanggal untuk mendapatkan laporan absensi praktikum yang diinginkan</p>
                </div>
            </div>

        </div>
    )
}