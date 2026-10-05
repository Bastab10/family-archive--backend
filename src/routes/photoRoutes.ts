import { Router } from "express";
import multer from "multer";

import {
  uploadPhotos,
  getPhotos,
  deletePhoto,
} from "../controllers/photoController";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

router.post(
  "/upload",
  upload.array("photos", 5),
  uploadPhotos
);

router.get("/", getPhotos);

router.delete("/:id", deletePhoto);

export default router;