const HowItWorksSection = () => (
    <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Tata Cara Penggunaan</h2>
        <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Persiapan Awal</h3>
            <p className="text-gray-800 mb-4">
                Mahasiswa diwajibkan melakukan pendaftaran wajah pada sistem sebelum praktikum dimulai.
                Wajah akan direkam dan disimpan sebagai data referensi.
            </p>
            <h3 className="text-xl font-semibold mb-4">Proses Absensi</h3>
            <p className="text-gray-800 mb-4">
                Saat memasuki laboratorium, mahasiswa berdiri di depan perangkat kamera yang telah terhubung
                dengan sistem. Sistem akan memindai wajah mahasiswa dan mencocokkannya dengan data yang tersimpan.
            </p>
            <h3 className="text-xl font-semibold mb-4">Konfirmasi oleh Asisten Laboratorium</h3>
            <p className="text-gray-800 mb-4">
                Asisten laboratorium dapat memantau status absensi melalui dashboard sistem secara real-time.
            </p>
        </div>
    </section>
);

export default HowItWorksSection;