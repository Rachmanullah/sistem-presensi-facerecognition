const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require('./route');
dotenv.config();
const path = require("path");
const app = express();

const PORT = process.env.PORT;

// Middleware untuk logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());
app.use(cors({
    credentials: true, origin: [
        "http://localhost:3000",
        "http://192.168.198.160:3000",
    ]
}));

// Routes
app.use('/api', routes);
app.use("/public/imagesFace", express.static(path.join(__dirname, "public/imagesFace")));
app.get('/', function (req, res) {
    res.send('Hello from Express API!');
})

app.listen(PORT, () => {
    console.log("Express API running in port : " + PORT);
});

module.exports = app;