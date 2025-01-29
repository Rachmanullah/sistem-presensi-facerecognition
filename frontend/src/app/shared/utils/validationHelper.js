const yup = require('yup');

export const userValidation = yup.object({
    username: yup.string().required('Username Required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password Required'),
    role: yup.string().required('Role Is Required'),
});

export const mahasiswaValidation = yup.object({
    nim: yup.string().required('NIM Is Required'),
    nama: yup.string().required('Nama Mahasiswa Is Required'),
    email: yup.string().email('Email is invalid').nullable(),
});

export const mahasiswaValidationArray = yup.array().of(
    yup.object().shape({
        nim: yup.string().required('NIM Is Required'),
        nama: yup.string().required('Nama Mahasiswa Is Required'),
        email: yup.string().email('Email is invalid').nullable(),
    })
);

export const laboratoriumValidation = yup.object({
    nama: yup.string().required('Nama Laboratorium Is Required')
});

export const praktikumValidation = yup.object({
    nama: yup.string().required('nama Praktikum Is Required'),
    periode: yup.string().required('periode Praktikum Is Required'),
    lab_id: yup.number().required('Laboratorium Is Required').moreThan(0, 'Laboratorium is required'),
});

export const Peserta_PraktikumValidation = yup.object({
    nim: yup.string().required('NIM Is Required'),
    praktikumID: yup.number().required('Praktikum Is Required').moreThan(0, 'Praktikum is required'),
    kelas: yup.string().required('Kelas Required')
});

export const absensiValidation = yup.object({
    praktikum_id: yup.number().required('Praktikum Is Required').moreThan(0, 'Praktikum is required'),
    kelas: yup.string().required('Kelas Required'),
    tanggal: yup.string().required('Tanggal Required'),
    pertemuan: yup.number().required('Pertemuan Required'),
    start_time: yup.string().required('Start Time'),
    durasi: yup.number().required('Durasi Required'),
});

export const Record_Absensi = yup.object({
    absensi_id: yup.number().required('Absensi Is Required').moreThan(0, 'Absensi is required'),
    mahasiswa_id: yup.number().required('Mahasiswa Is Required').moreThan(0, 'Mahasiswa is required'),
    status: yup.string().required('Status Is Required'),
});

export const thAkademikValidation = yup.object({
    tahun: yup.string().required('Tahun Akademik Harus diisi ex: xxxx/xxxx'),
    status: yup.string().oneOf(['Aktif', 'Tidak Aktif'], 'Status pilih salah satu.').default('Aktif'),
})