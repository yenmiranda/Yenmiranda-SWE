import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/availability", availabilityRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
