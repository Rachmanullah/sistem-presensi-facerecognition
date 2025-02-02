"use client";

import apiClient from "@/app/lib/apiClient";
import { useEffect, useState, useCallback } from "react";

export default function DashboardPage() {
    const [totalMhs, setTotalMhs] = useState(0);
    const [totalPraktikum, setTotalPraktikum] = useState(0);
    const [totalLaboratorium, setTotalLaboratorium] = useState(0);
    const [totalDataset, setTotalDataset] = useState(0);

    const animateCounter = (start, end, setter) => {
        let current = start;
        const step = Math.ceil((end - start) / 100);
        const interval = setInterval(() => {
            current += step;
            if (current >= end) {
                clearInterval(interval);
                current = end;
            }
            setter(current);
        }, 10);
    };

    const fetchCountData = useCallback(async () => {
        try {
            const [countMhs, countLab, countPraktikum, countDataset] = await Promise.all([
                apiClient.get("/mahasiswa/count/total"),
                apiClient.get("/laboratorium/count/total"),
                apiClient.get("/praktikum/count/total"),
                apiClient.get("/faceRecognition/count"),
            ]);

            animateCounter(0, countMhs.data.data, setTotalMhs);
            animateCounter(0, countLab.data.data, setTotalLaboratorium);
            animateCounter(0, countPraktikum.data.data, setTotalPraktikum);
            animateCounter(0, countDataset.data.data, setTotalDataset);
        } catch (error) {
            console.error("Error fetching count data:", error);
        }
    }, []);

    useEffect(() => {
        fetchCountData();
    }, [fetchCountData]);

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            </div>

            <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    <span className="font-medium">Info alert!</span> Selamat Datang Pada Sistem Absensi Face Recognition
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-200 ease-in-out">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0 .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2v11h-2V5a2 2 0 0 0-2-2H5Zm7 4a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm-6 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM7 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Zm1 3V8h1v1H8Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Jumlah Praktikum</h3>
                    <p className="mt-2 text-4xl font-bold">{totalPraktikum}</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-200 ease-in-out">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Jumlah Laboratorium</h3>
                    <p className="mt-2 text-4xl font-bold">{totalLaboratorium}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-200 ease-in-out">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Jumlah Mahasiswa</h3>
                    <p className="mt-2 text-4xl font-bold">{totalMhs}</p>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-200 ease-in-out">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7.205c4.418 0 8-1.165 8-2.602C20 3.165 16.418 2 12 2S4 3.165 4 4.603c0 1.437 3.582 2.602 8 2.602ZM12 22c4.963 0 8-1.686 8-2.603v-4.404c-.052.032-.112.06-.165.09a7.75 7.75 0 0 1-.745.387c-.193.088-.394.173-.6.253-.063.024-.124.05-.189.073a18.934 18.934 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.073a10.143 10.143 0 0 1-.852-.373 7.75 7.75 0 0 1-.493-.267c-.053-.03-.113-.058-.165-.09v4.404C4 20.315 7.037 22 12 22Zm7.09-13.928a9.91 9.91 0 0 1-.6.253c-.063.025-.124.05-.189.074a18.935 18.935 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.074a10.163 10.163 0 0 1-.852-.372 7.816 7.816 0 0 1-.493-.268c-.055-.03-.115-.058-.167-.09V12c0 .917 3.037 2.603 8 2.603s8-1.686 8-2.603V7.596c-.052.031-.112.059-.165.09a7.816 7.816 0 0 1-.745.386Z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Jumlah Dataset</h3>
                    <p className="mt-2 text-4xl font-bold">{totalDataset}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 dark:bg-gray-800">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Informasi Sistem</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistem Absensi Face Recognition ini bertujuan untuk meningkatkan akurasi dan efisiensi dalam proses absensi praktikum mahasiswa.
                </p>
            </div>
        </div>
    );
}
