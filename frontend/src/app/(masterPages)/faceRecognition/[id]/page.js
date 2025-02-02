"use client"
import apiClient from "@/app/lib/apiClient";
import { CircularProgress } from "@/app/shared/components";
import Image from "next/image";
import { use, useState, useEffect, useCallback } from "react";
export default function ImagesPages({ params }) {
    const { id } = use(params);
    const [dataset, setDataSet] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataImages = useCallback(async () => {
        try {
            const res = await apiClient.get(`/faceRecognition/${id}`, { cache: 'force-cache' });
            console.log(res);
            setDataSet(res.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching images: ", error);
        }
    }, [id]); // Tambahkan `id` sebagai dependency

    useEffect(() => {
        fetchDataImages();
    }, [fetchDataImages]);


    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">
                Dataset
            </h1>
            <h1 className="text-lg font-bold">Nama: {dataset.nama}</h1>
            <p className="text-lg text-gray-500">NIM: {dataset.nim}</p>
            {
                isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <CircularProgress size={50} />
                    </div>) :
                    <div className="grid grid-cols-3 gap-4">
                        {
                            dataset.length === 0 ? (
                                <p className="text-lg text-gray-600 text-center">
                                    Tidak ada dataset yang tersedia.
                                </p>
                            ) : (
                                dataset.images.map((image) => (
                                    <div key={image.id} className="p-4 border rounded shadow">
                                        <Image
                                            src={image.imageUrl}
                                            alt={`Image ${image.id}`}
                                            className="w-full h-auto object-cover rounded-lg"
                                            width={300}
                                            height={200}
                                        />
                                        <p className="text-center text-sm text-gray-500 mt-2">
                                            {new Date(image.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>
            }
        </div>
    )
}