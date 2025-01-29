import Cors from 'cors';

const cors = Cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:2000', // URL localhost
            process.env.BASE_URL_NGROK, // URL Ngrok
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy error'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Jika menggunakan cookie/token
});

// Menjalankan middleware CORS
const runMiddleware = (req) => {
    return new Promise((resolve, reject) => {
        cors(req, {}, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            resolve(result);
        });
    });
};

export default async function corsMiddleware(req) {
    await runMiddleware(req); // Jalankan middleware CORS
}
