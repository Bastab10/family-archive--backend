import express from "express";
import cors from "cors";

import photoRoutes from "./routes/photoRoutes";

const app = express();

const allowedOrigins = [
  "https://archive.bastabsaikia.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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