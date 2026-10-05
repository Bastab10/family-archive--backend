import express from "express";
import cors from "cors";

import photoRoutes from "./routes/photoRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
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