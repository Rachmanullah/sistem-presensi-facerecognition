'use client'
import { useSearch } from "@/app/hooks/useSearch";
import apiClient from "@/app/lib/apiClient";
import { CircularProgress } from "@/app/shared/components";
import { formatTanggal, formatWaktu } from "@/app/shared/utils/datetimeHelper";
import React from "react";
import { use } from "react";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import useForm from "@/app/hooks/useForm";
import Swal from "sweetalert2";


export default function RecordAbsensi({ params }) {
    const { id } = use(params);
    const [isLoading, setIsLoading] = React.useState(true);
    const [dataAbsensi, setDataAbsensi] = React.useState([]);
    const [dataRecord, setDataRecord] = React.useState([]);
    const [initialData, setInitialData] = React.useState([]);
    const [selectedData, setSelectedData] = React.useState(null);
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        praktikum_id: 0,
        status: "",
    });
    const { searchTerm, setSearchTerm } = useSearch(initialData, setDataRecord, ['Mahasiswa.nama', 'Mahasiswa.nim', "status"]);
    const [isEdit, setIsEdit] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const modalRef = React.useRef(null);
    const [error, setError] = React.useState(null);

    const fetchDataRecord = React.useCallback(async () => {
        try {
            await apiClient.get(`/record/absensi/${id}`, { cache: 'force-cache' })
                .then((res) => {
                    setDataAbsensi(res.data.data.absensi);
                    setDataRecord(res.data.data.record);
                    setInitialData(res.data.data.record);
                })
                .catch((err) => console.error(err));
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchDataRecord();
    }, [fetchDataRecord]);

    React.useEffect(() => {
        const interval = setInterval(fetchDataRecord, 30000);

        return () => clearInterval(interval);
    }, [fetchDataRecord]);

    useOutsideClick(modalRef, () => {
        setFormData({
            praktikum_id: 0,
            status: "",
        });
        setIsModalOpen(false);
        setIsEdit(false);
    });

    const handleEdit = (item) => {
        setIsEdit(true);
        setSelectedData(item)
        setFormData({
            praktikum_id: item.praktikum_id,
            status: item.status,
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.put(`/record/${selectedData.id}`, formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchDataRecord();
            resetForm();
            setIsEdit(false);
            setIsModalOpen(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            if (error.response && error.response.data.code == 400) {
                console.log(error.response.data.message);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <CircularProgress size={50} color="red-600" />
            </div>
        )
    }

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Data Record Absensi</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 transition hover:shadow-xl md:col-span-1">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Data Absensi</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Nama Praktikum</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{dataAbsensi.Praktikum.nama}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Kelas</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{dataAbsensi.kelas}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Pertemuan</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{dataAbsensi.pertemuan}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Tahun Akademik</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{dataAbsensi.tahun_akademik.tahun}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Tanggal</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{formatTanggal(dataAbsensi.tanggal)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Waktu Mulai</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{formatWaktu(dataAbsensi.start_time)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Waktu Selesai</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{formatWaktu(dataAbsensi.end_time)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Durasi</p>
                            <p className="text-gray-800">: </p>
                            <p className="text-gray-800 pl-1 flex-grow">{dataAbsensi.durasi} menit</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600 w-36">Status</p>
                            <p className="text-gray-800">:</p>
                            <p className="pl-1 flex-grow">
                                <span
                                    className={`text-gray-800 inline-block px-3 py-1 text-sm font-bold rounded-lg ${dataAbsensi.status === "Dibuka"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {dataAbsensi.status}
                                </span>
                            </p>
                        </div>

                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 transition hover:shadow-xl md:col-span-2">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Data Record</h2>
                    <div className="flex justify-end mb-4">
                        <form>
                            <label htmlFor="default-search" className="sr-only">Search</label>
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search Record"
                                    autoComplete="off"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">No</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">NIM</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Nama</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Status</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRecord.map((record, index) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{index + 1}</td>
                                        <td className="px-4 py-2 border-b">{record.Mahasiswa.nim}</td>
                                        <td className="px-4 py-2 border-b">{record.Mahasiswa.nama}</td>
                                        <td className="px-4 py-2 border-b">
                                            <span
                                                className={`inline-block px-3 py-1 text-sm font-bold rounded-lg ${record.status === "Hadir"
                                                    ? "bg-green-100 text-green-700" : record.status === "Belum Absen" ? "bg-slate-100 text-slate-700"
                                                        : record.status === "Tidak Hadir" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(record)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {dataRecord.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-gray-500 py-4">
                                            Tidak ada data record.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full dark:bg-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Update Status
                            </h3>
                            <form className="space-y-4">
                                <div className="relative z-0 w-full mb-5 group">
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status || ''}
                                        onChange={handleInputChange}
                                        className={`bg-gray-50 border border-gray-300 ${error?.status ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    >
                                        <option value="" hidden>Pilih status</option>
                                        <option value="Hadir">Hadir</option>
                                        <option value="Tidak Hadir">Tidak Hadir</option>
                                        <option value="Sakit">Sakit</option>
                                        <option value="Izin">Izin</option>
                                    </select>
                                    {error?.status && <p className="text-red-500 text-sm mt-1">{error?.status}</p>}
                                </div>
                                <button onClick={handleUpdate} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {isLoading ? <CircularProgress /> : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
