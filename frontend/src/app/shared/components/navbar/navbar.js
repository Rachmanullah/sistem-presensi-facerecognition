"use client"
import Link from "next/link";
import { ROUTES } from "../../routes/routes";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/apiClient";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from 'react';
import Image from "next/image";
import Cookies from "js-cookie";

export default function Navbar() {
    const router = useRouter();
    const { user } = useAuth();
    const [isClient, setIsClient] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);  // Toggle visibilitas dropdown
    };

    const handleLogout = async () => {
        try {
            console.log(user)
            const response = await apiClient.get(`/auth/logout/${user?.id}`);
            if (response) {
                Cookies.remove("user_session");
                router.push(ROUTES.login);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            data-drawer-target="logo-sidebar"
                            data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                ></path>
                            </svg>
                        </button>
                        <Link href={ROUTES.landingPage} className="flex ms-2 md:me-24">
                            <Image src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="FlowBite Logo" width={50} height={50} />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Face Recognition</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3 relative"> {/* Make sure this container is relative */}
                            <div>
                                <button
                                    type="button"
                                    onClick={toggleDropdown}
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    aria-expanded={isDropdownOpen ? "true" : "false"}
                                    data-dropdown-toggle="dropdown-user"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <Image
                                        className="w-8 h-8 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="user photo"
                                        width={50}
                                        height={50}
                                    />
                                </button>
                            </div>
                            {isDropdownOpen && (
                                <div
                                    className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-0 top-full mt-2"
                                    id="dropdown-user"
                                >
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            {user?.username}
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                role="menuitem"
                                            >
                                                Sign out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}