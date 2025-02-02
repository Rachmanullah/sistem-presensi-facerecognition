/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // Contoh yang sudah ada
            },
            {
                protocol: 'https',
                hostname: 'flowbite.com', // Contoh yang sudah ada
            },
            {
                protocol: 'https',
                hostname: 'helper.cnn-facerecognition.my.id', // Contoh yang sudah ada
            },
            {
                protocol: 'https',
                hostname: '1c01-103-154-144-186.ngrok-free.app', // untuk ngrok
            },
            {
                protocol: 'http',
                hostname: 'localhost', // Tambahkan ini
                port: '2000', // Port tempat server berjalan
                pathname: '/public/imagesFace/**', // Sesuaikan path-nya
            },
        ],
    },
};

export default nextConfig;
