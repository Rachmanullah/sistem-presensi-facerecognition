"use client"
import useForm from "@/app/hooks/useForm";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { useSearch } from "@/app/hooks/useSearch";
import { CircularProgress } from "@/app/shared/components"
import apiClient from "@/app/lib/apiClient";
import { useEffect, useRef, useState } from "react";
import { formatTanggal, formatWaktu } from "@/app/shared/utils/datetimeHelper";
import Swal from "sweetalert2";
import Link from "next/link";
import { ROUTES } from "@/app/shared/routes/routes";

export default function AbsensiPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dataAbsensi, setDataAbsensi] = useState([]);
    const [dataPraktikum, setDataPraktikum] = useState([]);
    const [selectedAbsensi, setSelectedAbsensi] = useState(null);
    const [initialData, setInitialData] = useState([]);
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        praktikum_id: 0,
        kelas: "",
        tanggal: "",
        pertemuan: 0,
        start_time: "",
        durasi: 0,
    });
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { searchTerm, setSearchTerm } = useSearch(initialData, setDataAbsensi, ['Praktikum.nama', 'kelas', 'pertemuan', 'tanggal', "status"]);
    const modalRef = useRef(null);
    const [error, setError] = useState(null);

    const fetchDataAbsensi = async () => {
        try {
            await apiClient.get('/absensi', { cache: 'force-cache' })
                .then((res) => {
                    setDataAbsensi(res.data.data);
                    setInitialData(res.data.data);
                    console.log(res.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    }

    const fetchDataPraktikum = async () => {
        try {
            await apiClient.get('/praktikum', { cache: 'force-cache' })
                .then((res) => {
                    setDataPraktikum(res.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchDataAbsensi();
        fetchDataPraktikum();
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchDataAbsensi, 30000);

        return () => clearInterval(interval);
    }, []);

    useOutsideClick(modalRef, () => {
        setFormData({
            praktikum_id: 0,
            kelas: "",
            tanggal: "",
            pertemuan: 0,
            start_time: "",
            durasi: 0,
        });
        setIsModalOpen(false);
        setIsEdit(false);
        setError(null)
    });

    const handleEdit = (absensi) => {
        setIsEdit(true);
        setSelectedAbsensi(absensi)
        setFormData({
            praktikum_id: absensi.praktikum_id,
            kelas: absensi.kelas,
            tanggal: absensi.tanggal.split('T')[0],
            pertemuan: absensi.pertemuan,
            start_time: new Date(absensi.start_time).toLocaleString("sv-SE", {
                timeZone: "Asia/Jakarta",
                hour12: false,
            }).replace(" ", "T"),
            durasi: absensi.durasi,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post('/absensi', formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchDataAbsensi();
            resetForm();
            setError(null)
            setIsModalOpen(false)
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            if (error.response && error.response.data.code == 400) {
                setError(error.response.data.message);
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.put(`/absensi/${selectedAbsensi.id}`, formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchDataAbsensi();
            resetForm();
            setIsEdit(false);
            setError(null)
            setIsModalOpen(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            if (error.response && error.response.data.code == 400) {
                setError(error.response.data.message);
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

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await apiClient.delete(`/absensi/${id}`)
                    .then((res) => {
                        fetchDataAbsensi();
                        Swal.fire({
                            title: "Deleted!",
                            text: 'Data Berhasil Dihapus',
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                        Swal.fire({
                            title: 'Error!',
                            text: err.response.data.message,
                            icon: 'error',
                        });
                    })
            }
        });
    }


    return (
        <div className="p-4" >
            <h1 className="text-2xl font-bold">Management Absensi</h1>

            <div className="flex justify-between relative items-center">
                <button onClick={() => setIsModalOpen(true)} className="relative inline-flex items-center justify-center p-0.5 mb-5 me-2 mt-5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Tambah
                    </span>
                </button>
                <form>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="search" id="default-search" className="block w-72 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Absensi" autoComplete="off" />
                    </div>
                </form>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full dark:bg-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {isEdit ? 'Edit Absensi' : 'Tambah Absensi'}
                        </h3>
                        <form className="space-y-4">
                            <div className="relative z-0 w-full mb-5 group">
                                <select
                                    id="praktikum_id"
                                    name="praktikum_id"
                                    value={formData.praktikum_id || ''}
                                    onChange={handleInputChange}
                                    className={`bg-gray-50 border border-gray-300 ${error?.praktikum_id ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                >
                                    <option value="" hidden>Pilih Praktikum</option>
                                    {dataPraktikum.map((praktikum) => (
                                        <option key={praktikum.id} value={praktikum.id}>
                                            {praktikum.nama}
                                        </option>
                                    ))}
                                </select>
                                {error?.praktikum_id && <p className="text-red-500 text-sm mt-1">{error?.praktikum_id}</p>}
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <select
                                    id="kelas"
                                    name="kelas"
                                    value={formData.kelas || ''}
                                    onChange={handleInputChange}
                                    className={`bg-gray-50 border border-gray-300 ${error?.kelas ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                >
                                    <option value="" hidden>Pilih Kelas</option>
                                    {Array.from({ length: 26 }, (_, i) => (
                                        <option key={i} value={String.fromCharCode(65 + i)}>
                                            {String.fromCharCode(65 + i)}
                                        </option>
                                    ))}
                                </select>
                                {error?.kelas && <p className="text-red-500 text-sm mt-1">{error?.kelas}</p>}
                            </div>
                            <div>
                                <label htmlFor="tanggal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal</label>
                                <input value={formData.tanggal} onChange={handleInputChange} type="date" name="tanggal" id="tanggal" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="tanggal" required />
                                {error?.tanggal && <p className="text-red-500 text-sm mt-1">{error?.tanggal}</p>}
                            </div>
                            <div>
                                <label htmlFor="pertemuan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pertemuan</label>
                                <input value={formData.pertemuan} onChange={handleInputChange} type="number" min={0} max={10} name="pertemuan" id="pertemuan" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="pertemuan" required />
                                {error?.pertemuan && <p className="text-red-500 text-sm mt-1">{error?.pertemuan}</p>}
                            </div>
                            <div>
                                <label htmlFor="start_time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Time</label>
                                <input value={formData.start_time} onChange={handleInputChange} type="datetime-local" name="start_time" id="start_time" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="start_time" required />
                                {error?.start_time && <p className="text-red-500 text-sm mt-1">{error?.start_time}</p>}
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <select
                                    id="durasi"
                                    name="durasi"
                                    value={formData.durasi || ''}
                                    onChange={handleInputChange}
                                    className={`bg-gray-50 border border-gray-300 ${error?.durasi ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                >
                                    <option value="" hidden>Pilih Durasi</option>
                                    <option value="5">5 Menit</option>
                                    <option value="10">10 Menit</option>
                                    <option value="15">15 Menit</option>
                                    <option value="20">20 Menit</option>
                                    <option value="25">25 Menit</option>
                                    <option value="30">30 Menit</option>
                                </select>
                                {error?.durasi && <p className="text-red-500 text-sm mt-1">{error?.durasi}</p>}
                            </div>
                            <button onClick={isEdit ? handleUpdate : handleSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {isLoading ? <CircularProgress /> : isEdit ? 'Update' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                no
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Praktikum
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Pertemuan
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Kelas
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Tanggal
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Start Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Durasi
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                End Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="text-center">
                                <td colSpan="10" className="py-4">
                                    <CircularProgress size={26} />
                                </td>
                            </tr>
                        ) : dataAbsensi.length > 0 ? (
                            dataAbsensi.map((item, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.Praktikum.nama}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.pertemuan}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.kelas}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {formatTanggal(item.tanggal)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {formatWaktu(item.start_time)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.durasi} Menit
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {formatWaktu(item.end_time)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-block px-3 py-1 text-sm font-bold rounded-lg ${item.status === "Dibuka"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-2">
                                            {
                                                item.status === "Dibuka" &&
                                                <button onClick={() => handleEdit(item)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                            }
                                            <Link href={ROUTES.recordAbseni(item.id)} className="font-medium text-green-600 dark:text-green-500 hover:underline">Record</Link>
                                            <button onClick={() => handleDelete(item.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td colSpan="10" className="px-6 py-4 text-center">
                                    <p>Data Tidak Tersedia</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}