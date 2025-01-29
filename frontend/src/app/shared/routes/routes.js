export const ROUTES = {
    landingPage: "/",
    presensiPage: "/presensi",
    dashboard: "/dashboard",
    mahasiswa: "/mahasiswa",
    user: "/user",
    tahunAkademik: "/tahunAkademik",
    laboratorium: "/laboratorium",
    praktikum: "/praktikum",
    pesertaPraktikum: (id) => `/praktikum/${id}`,
    absensi: "/absensi",
    recordAbseni: (id) => `/absensi/${id}`,
    faceRecognition: "/face-recognition",
    login: "/login",
    logout: "/api/auth/logout",
    laporan: '/laporan',
    imagesPages: (id) => `face-recognition/${id}`,
}

