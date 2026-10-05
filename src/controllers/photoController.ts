import { Request, Response } from "express";
import Photo from "../models/Photo";
import cloudinary from "../config/cloudinary";

const validCategories = [
  "wedding",
  "childhood",
  "grandparents",
  "family",
] as const;

type Category = (typeof validCategories)[number];

export const uploadPhotos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        message: "Please select at least 1 photo.",
      });
      return;
    }

    if (files.length > 5) {
      res.status(400).json({
        message: "You can upload a maximum of 5 photos.",
      });
      return;
    }

    const {
      title = "Family Memory",
      category = "family",
    } = req.body;

    if (
      typeof category !== "string" ||
      !validCategories.includes(category as Category)
    ) {
      res.status(400).json({
        message: "Invalid category",
      });
      return;
    }

    const lastPhoto = await Photo.findOne().sort({
      order: -1,
    });

    let nextOrder = lastPhoto
      ? lastPhoto.order + 1
      : 1;

    const uploadedPhotos = [];

    for (const file of files) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      const uploadResult =
        await cloudinary.uploader.unsigned_upload(
          dataUri,
          "family-album",
          {
            resource_type: "image",
          }
        );

      const photo = await Photo.create({
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        title,
        category: category as Category,
        order: nextOrder,
      });

      uploadedPhotos.push(photo);
      nextOrder++;
    }

    res.status(201).json({
      message: `${uploadedPhotos.length} photo${
        uploadedPhotos.length > 1 ? "s" : ""
      } uploaded successfully`,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error("Upload photos error:", error);

    res.status(500).json({
      message: "Failed to upload photos",
    });
  }
};

export const getPhotos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = req.query.category;

    if (
      category !== undefined &&
      (typeof category !== "string" ||
        !validCategories.includes(category as Category))
    ) {
      res.status(400).json({
        message: "Invalid category",
      });
      return;
    }

    const filter =
      typeof category === "string"
        ? { category: category as Category }
        : {};

    const photos = await Photo.find(filter).sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json(photos);
  } catch (error) {
    console.error("Get photos error:", error);

    res.status(500).json({
      message: "Failed to fetch photos",
    });
  }
};

export const deletePhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      res.status(404).json({
        message: "Photo not found",
      });
      return;
    }

    await cloudinary.uploader.destroy(photo.publicId);

    await Photo.findByIdAndDelete(photo._id);

    res.status(200).json({
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Delete photo error:", error);

    res.status(500).json({
      message: "Failed to delete photo",
    });
  }
};