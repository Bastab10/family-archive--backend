import { Router } from "express";
import multer from "multer";

import {
  uploadPhoto,
  getPhotos,
  deletePhoto,
} from "../controllers/photoController";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/upload", upload.single("photo"), uploadPhoto);

router.get("/", getPhotos);

router.delete("/:id", deletePhoto);

export default router;