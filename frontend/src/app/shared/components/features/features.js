import Image from "next/image";

const Features = () => (
    <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
                Fitur Utama
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
                        title: "Teknologi CNN Canggih",
                        desc: "Memanfaatkan AI modern untuk mengenali wajah dengan akurasi tinggi.",
                    },
                    {
                        img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=600&q=80",
                        title: "Absensi Otomatis",
                        desc: "Proses absensi lebih cepat, efisien, dan akurat tanpa formulir manual.",
                    },
                    {
                        img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
                        title: "Integrasi Lengkap",
                        desc: "Sistem yang dapat dihubungkan dengan sistem manajemen laboratorium.",
                    },
                ].map((feature, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out"
                    >
                        <Image
                            src={feature.img}
                            alt={feature.title}
                            width={600}
                            height={300}
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-2xl font-bold text-blue-600">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 mt-2">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Features;