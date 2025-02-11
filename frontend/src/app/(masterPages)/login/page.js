'use client'

import useForm from "@/app/hooks/useForm"
import apiClient from "@/app/lib/apiClient";
import { useState } from "react"
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/app/shared/routes/routes";
import { CircularProgress } from "@/app/shared/components";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { login } = useAuth()
    const { formData, handleInputChange, resetForm, setFormData } = useForm({
        username: '',
        password: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth', formData);
            console.log(response);
            login(response.data.data);
            setIsLoading(false);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 500
            });
            resetForm();
            router.push(ROUTES.dashboard);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            if (error.response && error.response.data.code === 400) {
                setError(error.response.data.message);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data.message,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 500
                });
            }
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md shadow-black sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                        <input value={formData.username} onChange={handleInputChange} type="text" name="username" id="username" autoComplete="off" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Username" required />
                        {error?.username && <p className="text-red-500 text-sm mt-1">{error?.username}</p>}

                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input value={formData.password} onChange={handleInputChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                        {error?.password && <p className="text-red-500 text-sm mt-1">{error?.password}</p>}
                    </div>
                    <div className="flex items-start">
                        <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div>
                    <button type="submit" onClick={handleSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {isLoading ? <CircularProgress /> : 'Login to your account'}
                    </button>
                </form>
            </div>
        </div>
    )
}