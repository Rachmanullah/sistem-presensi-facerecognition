"use client"
import { Footer, NavbarHome } from '@/app/shared/components';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import apiClient from '@/app/lib/apiClient';
import Swal from 'sweetalert2';
import AbsensiChecker from '@/app/shared/components/AbsensiChecker';
import axios from "axios";
import * as faceapi from "face-api.js";

export default function PresensiPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [dataAbsensi, setDataAbsensi] = useState([]);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [practical, setPractical] = useState({ absensi_id: 0, nim: "" });
    const [openCamera, setOpenCamera] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState('');
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const handlePracticalChange = (event) => {
        const { name, value } = event.target;
        setPractical((prev) => ({ ...prev, [name]: value }));
        if (name === "absensi_id") {
            const selectedAbsensi = dataAbsensi.find(absensi => absensi.id === parseInt(value));
            setSelectedMeeting(selectedAbsensi ? selectedAbsensi.pertemuan : '');
        }
    };

    const fetchDataAbsensi = async () => {
        try {
            const { data } = await apiClient.get('/absensi', { cache: 'force-cache' });
            console.log(data);
            const openAbsensi = data.data.filter(absensi => absensi.status === 'Dibuka');
            setDataAbsensi(openAbsensi);
        } catch (error) {
            console.error('Error fetching absensi:', error);
        }
    };

    useEffect(() => {
        fetchDataAbsensi();
        const interval = setInterval(fetchDataAbsensi, 30000);
        return () => clearInterval(interval);
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setOpenCamera(true);
            })
            .catch(err => console.error("Error accessing webcam: ", err));
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setOpenCamera(false);
        }
    };

    const cameraButton = () => {
        if (openCamera) {
            stopVideo();
        } else {
            startVideo();
            setHasCheckedIn(false);  // Reset check-in ketika kamera diaktifkan
        }
        setOpenCamera(!open);
    };

    const captureImage = async () => {
        if (!practical.nim || !practical.absensi_id) {
            Swal.fire({
                icon: "warning",
                title: "Form Tidak Lengkap",
                text: "Mohon isi NIM dan Absensi sebelum menyimpan data.",
                showConfirmButton: false,
                timer: 1000
            });
            return;
        }

        try {
            setLoading(true);
            console.log("Memuat model face-api...");
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
            await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
            console.log("Model berhasil dimuat.");

            console.log("Mendeteksi wajah...");
            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detections) {
                console.log("Tidak ada wajah terdeteksi.");
                Swal.fire("Error", "Wajah tidak terdeteksi!", "error");
                setLoading(false);
                return;
            }

            console.log("Wajah terdeteksi:", detections);
            const embedding = detections.descriptor;

            const payload = {
                nim: practical.nim,
                absensi_id: practical.absensi_id,
                embedding: Array.from(embedding),
            };

            console.log("Mengirim data ke backend:", payload);

            const response = await apiClient.post("/faceRecognition/predict", payload);
            console.log("Response backend:", response.data);

            if (response.data.code === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Presensi Berhasil",
                    text: response.data.message,
                    timer: 5000,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Presensi Gagal",
                    text: response.data.message,
                    timer: 5000,
                });
            }

        } catch (error) {
            console.log("Error extracting face embedding:", error);
            Swal.fire({
                icon: "error",
                title: "Presensi Gagal",
                text: error.response.data.message,
                timer: 5000,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-20">
            <AbsensiChecker />
            <NavbarHome />
            <div className="bg-gray-100 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-2">Face Recognition</h1>
                <p className="text-gray-500 text-sm text-center mb-6">Align your face in the camera frame for accurate detection.</p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    {/* Komponen Kamera */}
                    <div className="bg-white rounded-lg overflow-hidden relative shadow-md shadow-slate-800"
                        style={{
                            width: '640px', // Pertahankan lebar kamera
                            height: '480px', // Pertahankan tinggi kamera
                        }}
                    >
                        {!openCamera && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            width="640"
                            height="480"
                            playsInline
                            className="w-full object-cover"
                        />
                        <canvas
                            ref={canvasRef}
                            width="640"
                            height="480"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 10,
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>

                    {/* Form Input */}
                    <div className="bg-white shadow-md rounded-lg p-5 shadow-slate-800 w-[320px]">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Input Praktikum</h2>
                        <div className="gap-3 flex flex-col">
                            <select
                                id="absensi_id"
                                name="absensi_id"
                                value={practical.absensi_id || ''}
                                onChange={handlePracticalChange}
                                className={`bg-gray-50 border border-gray-300 ${error?.absensi_id ? 'text-red-500' : 'text-gray-900'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3`}
                            >
                                <option value="" hidden>Pilih Praktikum</option>
                                {dataAbsensi.map((absensi) => (
                                    <option key={absensi.id} value={absensi.id}>
                                        {absensi.Praktikum.nama} - {absensi.kelas} - {absensi.pertemuan}
                                    </option>
                                ))}
                            </select>
                            {error?.absensi_id && <p className="text-red-500 text-sm mb-3">{error?.absensi_id}</p>}
                            <input
                                type="text"
                                value={selectedMeeting}
                                readOnly
                                placeholder="Pertemuan"
                                className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-100"
                            />
                            <input
                                type="text"
                                value={practical.nim}
                                name="nim"
                                onChange={handlePracticalChange}
                                placeholder="NIM"
                                required
                                className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-100"
                            />
                            <button
                                className={`w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md`}
                                onClick={cameraButton}
                            >
                                {openCamera ? 'Stop Recognition' : 'Start Recognition'}
                            </button>
                            <button
                                className={`w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md`}
                                onClick={captureImage}
                                disabled={loading}
                            >
                                {loading ? "Proses..." : 'Simpan Presensi'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}