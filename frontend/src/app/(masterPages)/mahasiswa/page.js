"use client"
import useForm from "@/app/hooks/useForm";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { useSearch } from "@/app/hooks/useSearch";
import { CircularProgress } from "@/app/shared/components"
import apiClient from "@/app/lib/apiClient";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { exportToExcel } from "@/app/shared/utils/exportHelper";
import { importFromExcel } from "@/app/shared/utils/importHelper";

export default function MahasiswaPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dataMahasiswa, setDataMahasiswa] = useState([]);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [initialData, setInitialData] = useState([]);
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        nim: "",
        email: "",
        nama: ""
    });
    const [isEdit, setIsEdit] = useState(false);
    const [isImport, setIsImport] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { searchTerm, setSearchTerm } = useSearch(initialData, setDataMahasiswa, ['nim', 'email', 'nama']);
    const modalRef = useRef(null);
    const [error, setError] = useState(null);

    const fetchDataMahasiswa = async () => {
        try {
            await apiClient.get('/mahasiswa', { cache: 'force-cache' })
                .then((res) => {
                    setDataMahasiswa(res.data.data);
                    setInitialData(res.data.data)
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

    useEffect(() => {
        fetchDataMahasiswa();
    }, []);

    useOutsideClick(modalRef, () => {
        setFormData({ nim: "", email: "", nama: "" });
        setIsModalOpen(false);
        setIsEdit(false);
        setIsImport(false);
        setError(null);
    });

    const handleEdit = (mhs) => {
        setIsEdit(true);
        setSelectedMahasiswa(mhs)
        setFormData({ nim: mhs.nim, email: mhs.email, nama: mhs.nama });
        setIsModalOpen(true); // Open modal when editing
    };

    const handleImport = () => {
        setIsImport(true);
        setIsModalOpen(true)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importFromExcel(file, setFormData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post('/mahasiswa', formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchDataMahasiswa();
            resetForm();
            isImport && setIsImport(false);
            setError(null);
            setIsModalOpen(false); // Close modal after submission
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
            const response = await apiClient.put(`/mahasiswa/${selectedMahasiswa.id}`, formData);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });
            fetchDataMahasiswa();
            resetForm();
            setIsEdit(false);
            setError(null);
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

    const handleDelete = (mhsID) => {
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
                await apiClient.delete(`/mahasiswa/${mhsID}`)
                    .then((res) => {
                        fetchDataMahasiswa();
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
            <h1 className="text-2xl font-bold">Management Mahasiswa</h1>

            <div className="flex justify-between relative items-center">
                <div className=" flex justify-between relative items-center">
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
                    <button onClick={() => exportToExcel(dataMahasiswa, "Daftar Mahasiswa")} className="relative inline-flex items-center justify-center p-0.5 mb-5 me-2 mt-5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-red-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Export
                        </span>
                    </button>
                </div>
                <form>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="search" id="default-search" className="block w-72 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mahasiswa" autoComplete="off" />
                    </div>
                </form>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full dark:bg-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {isEdit ? 'Edit Mahasiswa' : isImport ? 'Import Mahasiswa' : 'Tambah Mahasiswa'}
                        </h3>
                        <form className="space-y-4">
                            {
                                isImport ? (
                                    <div>
                                        <label htmlFor="FileUpload" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File Upload</label>
                                        <input onChange={handleFileChange} accept=".xlsx, .xls" type="file" name="file" id="fileUpload" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="NIM" required />
                                        {/* <pre className="mt-4 bg-gray-100 p-4 rounded-lg">
                                            {JSON.stringify(formData, null, 2)}
                                        </pre> */}
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="nim" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NIM</label>
                                            <input value={formData.nim} onChange={handleInputChange} type="text" name="nim" id="nim" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="NIM" required />
                                            {error?.nim && <p className="text-red-500 text-sm mt-1">{error?.nim}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email</label>
                                            <input value={formData.email || ''} onChange={handleInputChange} type="email" name="email" id="email" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Email" required />
                                            {error?.email && <p className="text-red-500 text-sm mt-1">{error?.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="nama" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nama</label>
                                            <input value={formData.nama} onChange={handleInputChange} type="text" name="nama" id="nama" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Nama" required />
                                            {error?.nama && <p className="text-red-500 text-sm mt-1">{error?.nama}</p>}
                                        </div>
                                    </>
                                )
                            }
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
                            <th scope="col" className="px-6 py-3">
                                no
                            </th>
                            <th scope="col" className="px-6 py-3">
                                nim
                            </th>
                            <th scope="col" className="px-6 py-3">
                                name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="text-center">
                                <td colSpan="5" className="py-4">
                                    <CircularProgress size={26} />
                                </td>
                            </tr>
                        ) : dataMahasiswa.length > 0 ? (
                            dataMahasiswa.map((item, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.nim}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.nama}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(item)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td colSpan="5" className="px-6 py-4 text-center">
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