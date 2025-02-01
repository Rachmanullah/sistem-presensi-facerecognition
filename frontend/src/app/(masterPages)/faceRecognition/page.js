"use client";
import apiClient from "@/app/lib/apiClient";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import axios from "axios";
import * as faceapi from "face-api.js";

export default function FaceRecognitionPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photos, setPhotos] = useState([]); // State untuk menyimpan foto
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [formData, setFormData] = useState({
        nim: "",
        nama: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingLoadData, setIsLoadingLoadData] = useState(true);
    const [allSuggestions, setAllSuggestions] = useState([]); // Simpan semua data dari API
    const [suggestions, setSuggestions] = useState([]); // Simpan data yang difilter
    const [isFocused, setIsFocused] = useState(false); // State untuk kontrol fokus input
    const [radioValue, setRadioValue] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingLoadData(true);
                await fetchSuggestions();
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoadingLoadData(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            fetchSuggestions();
        }, 3000);

        return () => { clearInterval(interval) }
    }, []);

    const handleRadioButton = (e) => {
        const selectedRadio = e.target.value;
        if (selectedRadio === "capture-radio") {
            setRadioValue("capture-radio");
        } else if (selectedRadio === "upload-radio") {
            setRadioValue("upload-radio");
        } else {
            setRadioValue(null);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "nim" && value) {
            const filteredSuggestions = allSuggestions.filter((item) => {
                const nim = String(item.nim || "");
                return nim.includes(value); // Cocokkan substring
            });
            setSuggestions(filteredSuggestions); // Update daftar saran
        } else {
            setSuggestions([]);
            setFormData({ nim: '', nama: '' })
        }
    };

    const fetchSuggestions = async (nim) => {
        try {
            await apiClient.get(`/mahasiswa`, { cache: 'force-cache' })
                .then((res) => {
                    setAllSuggestions(res.data.data || []); // Asumsikan API mengembalikan array data
                })
                .catch((err) => { console.log(err) });

        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData({ nim: suggestion.nim, nama: suggestion.nama });
        setSuggestions([]);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(files);
    };

    const startVideo = () => {
        console.log("Memulai aliran video...");
        if (videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    console.log("Aliran video dimulai.");
                    setIsCameraActive(true);
                })
                .catch((err) => console.error("Error accessing webcam: ", err));
        } else {
            console.error("Video element is not available");
            Swal.fire("Error", "Gagal mengakses kamera!", "error");
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    const capturePhoto = () => {
        const canvas = document.createElement("canvas"); // Gunakan elemen canvas
        const video = videoRef.current;

        if (canvas && video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");

            // Tangkap frame dari video
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Konversi ke URL
            const photoURL = canvas.toDataURL("image/jpeg");
            setPhotos((prevPhotos) => [...prevPhotos, photoURL]);
        }
    };

    const dataURLtoBlob = (dataURL) => {
        const [header, base64String] = dataURL.split(",");
        const byteString = atob(base64String);
        const mimeType = header.match(/:(.*?);/)[1];
        const arrayBuffer = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            arrayBuffer[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: mimeType });
    };


    const saveDataRegistered = async () => {
        if (!formData.nim || !formData.nama) {
            Swal.fire({
                icon: "warning",
                title: "Form Tidak Lengkap",
                text: "Mohon isi NIM dan Nama sebelum menyimpan data.",
                showConfirmButton: false,
                timer: 1000
            });
            return;
        }

        if (photos.length + uploadedFiles.length < 1) {
            Swal.fire({
                icon: "warning",
                title: "Batas Minimum Belum Tercapai",
                text: "Anda harus mengambil minimum 10 foto per sesi registrasi.",
                showConfirmButton: false,
                timer: 1000
            });
            return;
        }

        try {
            setIsLoading(true);
            let detectedFaces = 0;
            console.log("Memuat model face-api...");

            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
            await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
            console.log("Model berhasil dimuat.");

            let embeddings = [];
            const formDataToSend = new FormData();
            formDataToSend.append("nim", formData.nim);

            // Proses foto dari webcam
            for (let i = 0; i < photos.length; i++) {
                const blob = dataURLtoBlob(photos[i]);
                const img = document.createElement("img");
                img.src = photos[i];
                await img.decode();

                const detections = await faceapi
                    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detections) {
                    detectedFaces++; // Tambah jumlah wajah yang terdeteksi
                    formDataToSend.append("photos", blob, `${formData.nim}-photo-${i}.jpg`);
                    embeddings.push(Array.from(detections.descriptor));
                } else {
                    console.warn(`Tidak ada wajah terdeteksi pada foto webcam ${i + 1}`);
                }
            }


            //Tambahkan file yang diunggah
            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];

                // **Buat URL gambar dari file yang diunggah**
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                await img.decode();

                const detections = await faceapi
                    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detections) {
                    detectedFaces++; // Tambah jumlah wajah yang terdeteksi
                    formDataToSend.append("photos", file, `${formData.nim}-uploads-${i}.jpg`);
                    embeddings.push(Array.from(detections.descriptor));
                } else {
                    console.warn(`Tidak ada wajah terdeteksi pada file upload ${i + 1}`);
                }
            }

            // **Jika tidak ada wajah terdeteksi, tampilkan peringatan dan hentikan proses**
            if (detectedFaces === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Tidak Ada Wajah Terdeteksi",
                    text: "Pastikan wajah terlihat jelas dalam gambar yang Anda unggah.",
                    showConfirmButton: true
                });
                setIsLoading(false);
                return;
            }

            console.log("Mengunggah gambar...");
            console.log("Gambar berhasil diunggah. Menyimpan embeddings...");

            // Kirim embeddings ke server
            console.log('Embedding Data : ', embeddings);
            formDataToSend.append("embedding", JSON.stringify(embeddings));
            
            const response = await apiClient.post("/faceRecognition/register", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("result : ", response)
            if (response) {
                Swal.fire({
                    icon: "success",
                    title: "Registrasi Berhasil",
                    text: "Wajah telah berhasil diregistrasi.",
                    showConfirmButton: false,
                    timer: 1000
                });

                // Reset form setelah berhasil
                setPhotos([]);
                setFormData({ nim: "", nama: "" });
                setUploadedFiles([]);
            } else {
                throw new Error("Gagal menyimpan embedding.");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", error.message, "error");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col p-6 items-center">
            <div className="container mx-auto px-6 py-8">

                <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
                    Face Recognition
                </h1>

                <div className="flex justify-center space-x-4 mb-10">
                    <button
                        // onClick={handleTraining}
                        className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
                    >
                        Train Model
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
                    >
                        Register Face
                    </button>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div
                    id="popup-modal"
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 overflow-y-auto"
                >
                    <div className="relative p-4 w-full max-w-4xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Close Button */}
                            <button
                                type="button"
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>

                            {/* Modal Content */}
                            <div className="p-4 md:p-5 overflow-y-auto max-h-[80vh]">
                                <h3 className="mb-5 text-lg font-semibold text-gray-700 dark:text-white text-center">
                                    Form Registrasi Wajah
                                </h3>
                                <div className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                    <svg className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span className="sr-only">Info</span>
                                    <div>
                                        <span className="font-medium">Ketentuan Melakukan Registrasi Wajah:</span>
                                        <ul className="mt-1 list-disc list-inside">
                                            <li>NIM Mahasiswa Harus terdaftar pada Data Mahasiswa</li>
                                            <li>Inputkan NIM sesuai NIM Mahasiswa</li>
                                            <li>Lakukan Capture Wajah Minimal 10 Gambar</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Form Section */}
                                    <div>
                                        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                                            Input Data Mahasiswa
                                        </h4>
                                        <form className="gap-4 flex flex-col">
                                            <input
                                                value={formData.nim}
                                                onChange={handleInputChange}
                                                name="nim"
                                                type="text"
                                                placeholder="NIM"
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                autoComplete="off"
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay untuk klik saran
                                            />
                                            {/* Kotak Saran */}
                                            {isFocused && suggestions.length > 0 && (
                                                <ul
                                                    className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto z-10"
                                                    style={{ marginTop: "50px" }} // Tambahkan jarak agar tidak menutup input
                                                >
                                                    {suggestions.map((suggestion, index) => (
                                                        <li
                                                            key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleSuggestionClick(suggestion)} // Isi NIM dan Nama
                                                        >
                                                            {suggestion.nim} - {suggestion.nama} {/* Tampilkan data */}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <input
                                                value={formData.nama}
                                                onChange={handleInputChange}
                                                name="nama"
                                                type="text"
                                                placeholder="Nama"
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-300"
                                                autoComplete="off"
                                                readOnly
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                                                    <input id="bordered-radio-1" onChange={handleRadioButton} type="radio" value="capture-radio" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="bordered-radio-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Capture</label>
                                                </div>
                                                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                                                    <input id="bordered-radio-2" onChange={handleRadioButton} type="radio" value="upload-radio" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="bordered-radio-2" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Upload</label>
                                                </div>
                                            </div>
                                            {radioValue === "upload-radio" && (
                                                <div className="mb-4">
                                                    <label htmlFor="upload" className="block text-gray-700 font-medium mb-2">
                                                        Upload Gambar
                                                    </label>
                                                    <input
                                                        id="upload"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                                                        onChange={handleFileUpload}
                                                    />
                                                </div>
                                            )}

                                            {radioValue === "capture-radio" && (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                                                        onClick={startVideo}
                                                    >
                                                        Aktifkan Kamera
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 mt-3 rounded-lg"
                                                        onClick={stopVideo}
                                                    >
                                                        Matikan Kamera
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                        {/* Foto yang Diambil */}
                                        <h3 className="text-lg mt-6 mb-3 text-gray-700 font-semibold">
                                            Foto yang Diambil ({photos.length})
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {photos.map((photo, index) => (
                                                <div key={index} className="w-16 h-16">
                                                    <Image
                                                        src={photo}
                                                        alt={`Photo ${index + 1}`}
                                                        width={64} // Lebar dalam piksel (16 x 4 = 64px)
                                                        height={64} // Tinggi dalam piksel
                                                        className="rounded-lg shadow"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* foto yang diunggah */}
                                        <h3 className="text-lg mt-6 mb-3 text-gray-700 font-semibold">
                                            Gambar yang Diunggah ({uploadedFiles.length})
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {uploadedFiles.map((file, index) => {
                                                const objectURL = URL.createObjectURL(file);
                                                return (
                                                    <div key={index} className="w-16 h-16 relative">
                                                        <Image
                                                            src={objectURL}
                                                            alt={`Uploaded ${file.name}`}
                                                            width={64} // Lebar dalam piksel
                                                            height={64} // Tinggi dalam piksel
                                                            className="rounded-lg shadow"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Kamera Section */}
                                    <div className="bg-gray-100 rounded-lg shadow-lg relative">
                                        {/* Kamera Section */}
                                        <div className="relative w-full h-[300px] md:h-[480px]">
                                            <video
                                                ref={videoRef}
                                                className="absolute w-full h-full top-0 left-0 object-cover rounded-lg z-10"
                                                autoPlay
                                                playsInline
                                            ></video>
                                            <canvas
                                                ref={canvasRef}
                                                className="absolute w-full h-full top-0 left-0 rounded-lg z-20"
                                            ></canvas>
                                        </div>

                                        {/* Tombol Capture */}
                                        <button
                                            type="button"
                                            className={`w-full  ${!isCameraActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}  text-white font-medium py-3 mt-4 rounded-lg z-30 relative`}
                                            onClick={capturePhoto}
                                            disabled={!isCameraActive}
                                        >
                                            Capture Gambar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                                <button
                                    type="button"
                                    className="py-2 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="ms-3 py-2 px-5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={saveDataRegistered}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Menyimpan..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}