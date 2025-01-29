'use client'

import React from "react";
import { use } from "react";
import apiClient from "@/app/lib/apiClient";
import { useSearch } from "@/app/hooks/useSearch";
import { CircularProgress } from "@/app/shared/components";
import useForm from "@/app/hooks/useForm";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import Swal from "sweetalert2";
import { importFromExcel } from "@/app/shared/utils/importHelper";

export default function PesertaPraktikum({ params }) {
    const { id } = use(params);
    const [dataPraktikum, setDataPraktikum] = React.useState([]);
    const [dataMhs, setDataMhs] = React.useState([]);
    const [initialData, setInitialData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(null);
    const modalRef = React.useRef(null);
    const { searchTerm, setSearchTerm } = useSearch(initialData, setDataMhs, ['Mahasiswa.nim', 'Mahasiswa.nama']);
    const [error, setError] = React.useState(null);
    const [isImport, setIsImport] = React.useState(false);
    const [dataImport, setDataImport] = React.useState([]);
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        praktikumID: id,
        nim: "",
        nama: "",
        kelas: ""
    });

    const fetchData = React.useCallback(async () => {
        try {
            const res = await apiClient.get(`/praktikum/${id}/peserta`, {
                cache: 'force-cache',
                // params: { type: "praktikumID" },
            });
            setDataPraktikum(res.data.data.praktikum);
            setDataMhs(res.data.data.peserta);
            setInitialData(res.data.data.peserta);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);


    useOutsideClick(modalRef, () => {
        setFormData({
            praktikumID: id,
            nim: "",
            nama: "",
            kelas: ""
        });
        setIsModalOpen(false);
        setIsEdit(false);
        setIsImport(false);
        setError(null)
    });

    const handleImport = () => {
        setIsImport(true);
        setIsModalOpen(true)
    }

    const handleExport = () => {
        const data = dataMhs.map((item) => {
            return {
                nim: item.Mahasiswa.nim,
                nama: item.Mahasiswa.nama,
                kelas: item.kelas
            }
        })
        exportToExcel(data, `Daftar Peserta Praktikum ${dataPraktikum.nama}`)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importFromExcel(file, setDataImport);
        }
    };

    React.useEffect(() => {
        if (dataImport.length > 0) {
            const updatedData = dataImport.map((item) => ({
                ...item,
                praktikumID: id,
            }));
            setFormData(updatedData);
        }
    }, [dataImport, id, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log("Data yang akan dikirim:", formData);
            const response = await apiClient.post('/praktikum/peserta', formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchData();
            resetForm();
            setError(null)
            isImport && setIsImport(false);
            setIsModalOpen(false); // Close modal after submission
        } catch (error) {
            setIsLoading(false);
            console.error("Detail Error:", error.response?.data || error.message);
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

    const handleEdit = (item) => {
        setIsEdit(true);
        setSelectedData(item)
        setFormData({ kelas: item.kelas });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.put(`/praktikum/peserta/${selectedData.id}`, formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchData();
            resetForm();
            setError(null)
            setIsEdit(false);
            setIsModalOpen(false); // Close modal after update
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

    const handleDelete = (itemID) => {
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
                await apiClient.delete(`/praktikum/peserta/${itemID}`)
                    .then((res) => {
                        fetchData();
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
        <div className="p-4">

            <div className="bg-white rounded-lg shadow-lg p-6 transition hover:shadow-xl md:col-span-2">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar Praktikan {dataPraktikum.nama}</h1>
                <div className="flex justify-between relative mb-4 items-center">
                    <div className="flex justify-between relative items-center">
                        <button onClick={() => setIsModalOpen(true)} className="relative inline-flex items-center justify-center p-0.5 mb-5 me-2 mt-5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Tambah
                            </span>
                        </button>
                        <button onClick={handleImport} className="relative inline-flex items-center justify-center p-0.5 mb-5 me-2 mt-5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-lime-500 to-green-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Import
                            </span>
                        </button>
                        <button onClick={handleExport} className="relative inline-flex items-center justify-center p-0.5 mb-5 me-2 mt-5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-red-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Export
                            </span>
                        </button>
                    </div>
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
                                placeholder="Search Praktikan"
                                autoComplete="off"
                            />
                        </div>
                    </form>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                            <h3 className="text-xl font-semibold mb-4">
                                {isEdit ? `Edit Kelas ${selectedData.Mahasiswa.nim}` : isImport ? `Import Data Praktikan ${dataPraktikum.nama}` : 'Tambah Praktikan'}
                            </h3>
                            <form className="space-y-4">
                                {isImport ? (
                                    <div>
                                        <label htmlFor="FileUpload" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File Upload</label>
                                        <input onChange={handleFileChange} accept=".xlsx, .xls" type="file" name="file" id="fileUpload" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="File" required />
                                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                    </div>
                                ) : isEdit ? (
                                    <div>
                                        <label htmlFor="kelas" className="block mb-2 text-sm font-medium">
                                            Kelas
                                        </label>
                                        <select
                                            id="kelas"
                                            name="kelas"
                                            value={formData.kelas}
                                            onChange={handleInputChange}
                                            className={`bg-gray-50 border border-gray-300 ${error?.kelas ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                            required
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
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="nim" className="block mb-2 text-sm font-medium">NIM</label>
                                            <input
                                                id="nim"
                                                name="nim"
                                                value={formData.nim}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                placeholder="NIM"
                                                required
                                            />
                                            {error?.nim && <p className="text-red-500 text-sm mt-1">{error?.nim}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="nama" className="block mb-2 text-sm font-medium">Nama</label>
                                            <input
                                                id="nama"
                                                name="nama"
                                                value={formData.nama}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                placeholder="Nama"
                                                required
                                            />
                                            {error?.nama && <p className="text-red-500 text-sm mt-1">{error?.nama}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="kelas" className="block mb-2 text-sm font-medium">Kelas</label>
                                            <select
                                                id="kelas"
                                                name="kelas"
                                                value={formData.kelas}
                                                onChange={handleInputChange}
                                                className={`bg-gray-50 border border-gray-300 ${error?.kelas ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                                required
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
                                    </>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={isEdit ? handleUpdate : handleSubmit}
                                    className={`w-full px-4 py-2 text-white rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                                >
                                    {isLoading ? <CircularProgress /> : isEdit ? 'Update' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">No</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">NIM</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Nama</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Kelas</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="text-center">
                                    <td colSpan="5" className="py-4">
                                        <CircularProgress size={26} />
                                    </td>
                                </tr>
                            ) : dataMhs.length > 0 ? dataMhs.map((praktikan, index) => (
                                <tr key={praktikan.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 border-b">{praktikan.Mahasiswa.nim}</td>
                                    <td className="px-4 py-2 border-b">{praktikan.Mahasiswa.nama}</td>
                                    <td className="px-4 py-2 border-b">{praktikan.kelas}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(praktikan)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(praktikan.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : dataMhs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500 py-4">
                                        Tidak ada data praktikan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}