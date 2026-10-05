import express from "express";
import cors from "cors";

import photoRoutes from "./routes/photoRoutes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://archive.bastabsaikia.in",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Family Digital Album API is running",
  });
});

app.use("/api/photos", photoRoutes);

export default app;