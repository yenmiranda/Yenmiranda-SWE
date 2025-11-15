//base imports
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { runCleanupWorker } from './workers/cleanupWorker.js';

//imports for api
import availabilityRoutes from './routes/availabilityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

//imports for keypaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPath = path.resolve(__dirname, 'certs/key.pem');
const certPath = path.resolve(__dirname, 'certs/cert.pem');

//key paths for https
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

//server constands
const app = express();
const port = process.env.PORT || 3000;
const httpsServer = https.createServer(options, app);

//middleware for server
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//api calls
app.get("/api/health", (_req, res) => res.json({ ok: true, message: "Server is healthy" }));
app.use("/api/auth", authRoutes); 
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes); 

//frontend paths
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use('/', express.static(path.join(frontendPath, 'login')));
app.use('/', express.static(path.join(frontendPath, 'booking')));
app.use('/', express.static(path.join(frontendPath, 'availability')));

//base location
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login', 'Login.html'));
});

//start server
httpsServer.listen(port, () => { 
    console.log(`HTTPS server running on https://localhost:${3000}`);
    runCleanupWorker();//runs cleanup worker
    setInterval(runCleanupWorker, 360000)
});