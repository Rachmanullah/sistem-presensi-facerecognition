const FaceRecognitionSystemSection = () => (
    <section className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6">Sistem Absensi Face Recognition</h2>
        <p className="text-lg text-gray-800 mb-4">
            Sistem absensi berbasis Face Recognition hadir sebagai solusi modern untuk mendukung
            efisiensi dan keadilan di Prodi Teknik Informatika. Sistem ini menggunakan teknologi
            biometrik untuk mengidentifikasi mahasiswa secara otomatis melalui wajah.
        </p>
        <div className="bg-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Face Recognition dan Metode CNN</h3>
            <p className="text-gray-800 mb-4">
                Face Recognition (Pengenalan Wajah) adalah teknologi biometrik yang menggunakan
                karakteristik unik wajah manusia untuk identifikasi dan autentikasi. Sistem ini
                menggunakan Convolutional Neural Networks (CNN), yang bekerja dengan:
            </p>
            <ul className="list-disc list-inside text-left">
                <li><strong>Feature Extraction:</strong> Mendeteksi pola unik pada wajah seperti bentuk mata, hidung, dan kontur wajah.</li>
                <li><strong>Classification:</strong> Mengidentifikasi wajah berdasarkan data yang telah dilatih sebelumnya.</li>
            </ul>
            <p className="text-gray-800 mt-4">
                CNN memiliki tingkat akurasi yang tinggi, bahkan dalam kondisi pencahayaan atau sudut wajah yang berbeda.
            </p>
        </div>
    </section>
);

export default FaceRecognitionSystemSection;