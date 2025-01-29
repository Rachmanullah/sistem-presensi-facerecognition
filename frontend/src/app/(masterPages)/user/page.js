"use client"
import useForm from "@/app/hooks/useForm";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { useSearch } from "@/app/hooks/useSearch";
import { CircularProgress } from "@/app/shared/components"
import apiClient from "@/app/lib/apiClient";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function UserPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dataUser, setDataUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [initialData, setInitialData] = useState([]);
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        username: "",
        password: "",
        role: ""
    });
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { searchTerm, setSearchTerm } = useSearch(initialData, setDataUser, ['username', 'role']);
    const modalRef = useRef(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            await apiClient.get('/user', { cache: 'force-cache' })
                .then((res) => {
                    setDataUser(res.data.data);
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
        fetchData();
    }, []);


    useOutsideClick(modalRef, () => {
        setFormData({
            username: "",
            password: "",
            role: ""
        });
        setIsModalOpen(false);
        setIsEdit(false);
        setError(null);
    });

    const handleEdit = (user) => {
        setIsEdit(true);
        setSelectedUser(user)
        setFormData({ username: user.username, role: user.role });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post('/user', formData);
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
            const response = await apiClient.put(`/user/${selectedUser.id}`, formData);
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
            setError(null);
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

    const handleDelete = (userID) => {
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
                await apiClient.delete(`/user/${userID}`)
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
        <div className="p-4" >
            <h1 className="text-2xl font-bold">Management User</h1>

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
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="search" id="default-search" className="block w-72 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search User" autoComplete="off" />
                    </div>
                </form>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full dark:bg-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {isEdit ? 'Edit User' : 'Tambah User'}
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input value={formData.username} onChange={handleInputChange} type="text" name="username" id="username" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="username" required />
                                {error?.username && <p className="text-red-500 text-sm mt-1">{error?.username}</p>}
                            </div>
                            {
                                !isEdit &&
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input value={formData.password} onChange={handleInputChange} type="password" name="password" id="password" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="password" required />
                                    {error?.password && <p className="text-red-500 text-sm mt-1">{error?.password}</p>}
                                </div>
                            }
                            <div className="relative z-0 w-full mb-5 group">
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role || ''}
                                    onChange={handleInputChange}
                                    className={`bg-gray-50 border border-gray-300 ${error?.role ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                >
                                    <option value="" hidden>Pilih Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Aslab">Aslab</option>
                                    <option value="Kalab">Kalab</option>
                                </select>
                                {error?.role && <p className="text-red-500 text-sm mt-1">{error?.role}</p>}
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
                            <th scope="col" className="px-6 py-3">
                                no
                            </th>
                            <th scope="col" className="px-6 py-3">
                                username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="text-center">
                                <td colSpan="4" className="py-4">
                                    <CircularProgress size={26} />
                                </td>
                            </tr>
                        ) : dataUser.length > 0 ? (
                            dataUser.map((item, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.role}
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
                                <td colSpan="4" className="px-6 py-4 text-center">
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