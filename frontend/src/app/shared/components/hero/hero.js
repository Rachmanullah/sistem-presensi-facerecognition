const Hero = () => (
    <section
        id="home"
        className="relative h-[500px] flex items-center justify-center text-center bg-cover bg-center"
        style={{
            backgroundImage:
                "url('https://media.istockphoto.com/id/1005771222/id/foto/latar-belakang-teknologi-abstrak-kode-pemrograman-pengembang-perangkat-lunak-dan-skrip-komputer.jpg?s=612x612&w=0&k=20&c=_BCT7Woz9oVUMQhkhWp6X2XWDu75qGOw7qy_VVQIW-c=')",
        }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
        <div className="relative z-10 text-white px-6 py-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-shadow-lg">
                Selamat Datang di Sistem Absensi Pengenalan Wajah
            </h1>
            <p className="text-lg md:text-xl mb-6">
                Solusi Praktis untuk Manajemen Kehadiran Praktikum Anda
            </p>
            <div className="flex justify-center space-x-6">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105">
                    <i className="fas fa-play mr-2"></i> Mulai Sekarang
                </button>
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105">
                    <i className="fas fa-info-circle mr-2"></i> Lihat Fitur
                </button>
            </div>
        </div>
    </section>
);

export default Hero;