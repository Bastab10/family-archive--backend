import { Request, Response } from "express";
import Photo from "../models/Photo";
import cloudinary from "../config/cloudinary";

export const uploadPhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "No photo uploaded",
      });
      return;
    }

    const { title = "Family Memory" } = req.body;

    const lastPhoto = await Photo.findOne().sort({
      order: -1,
    });

    const nextOrder = lastPhoto ? lastPhoto.order + 1 : 1;

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const uploadResult = await cloudinary.uploader.unsigned_upload(
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
      order: nextOrder,
    });

    res.status(201).json({
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error: any) {
    console.error("========== CLOUDINARY UPLOAD ERROR ==========");
    console.error("Message:", error?.message);
    console.error("HTTP Code:", error?.http_code);
    console.error("Name:", error?.name);
    console.error("Full Error:", JSON.stringify(error, null, 2));
    console.error("HTTP Headers:", error?.headers);
    console.error("Response:", error?.response);
    console.error("==============================================");

    res.status(500).json({
      message: "Failed to upload photo",
      error: error?.message,
    });
  }
};

export const getPhotos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const photos = await Photo.find().sort({
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