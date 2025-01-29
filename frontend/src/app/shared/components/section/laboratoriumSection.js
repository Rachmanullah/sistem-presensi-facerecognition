const laboratories = [
    {
        title: 'Laboratorium Mobile & Embedded',
        subjects: ['Sistem Embedded dan Mikrokontroler (Semester Ganjil)', 'Mobile Programming (Semester Genap)'],
    },
    {
        title: 'Laboratorium Pemrograman',
        subjects: ['Algoritma dan Pemrograman (Semester Genap)', 'Object Oriented Programming (Semester Genap)'],
    },
    {
        title: 'Laboratorium Database',
        subjects: ['Pemrograman Web (Semester Ganjil)', 'Basis Data (Semester Genap)'],
    },
    {
        title: 'Laboratorium Jaringan Komputer',
        subjects: ['Jaringan Komputer (Semester Ganjil)', 'Kecerdasan Buatan (Semester Genap)'],
    },
    {
        title: 'Laboratorium Pengolahan Citra dan Multimedia',
        subjects: ['Sistem Multimedia dan Pengolahan Citra Digital (Semester Ganjil)', 'Animasi dan Game Developer (Semester Genap)'],
    },
];

const LaboratoriesSection = () => (
    <section id="labs" className="mb-12 px-4">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">
            <i className="fas fa-flask text-blue-400 mr-2"></i> Laboratorium Utama
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {laboratories.map((lab, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
                >
                    <h3 className="text-xl font-semibold mb-4">{lab.title}</h3>
                    <ul className="list-disc list-inside">
                        {lab.subjects.map((subject, idx) => (
                            <li key={idx}>{subject}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </section>
);

export default LaboratoriesSection;
