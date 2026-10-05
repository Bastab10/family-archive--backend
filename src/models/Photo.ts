import mongoose, { Document, Schema } from "mongoose";

export interface IPhoto extends Document {
  imageUrl: string;
  publicId: string;
  title: string;
  category: "wedding" | "childhood" | "grandparents" | "family";
  order: number;
  createdAt: Date;
}

const photoSchema = new Schema<IPhoto>(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      default: "Family Memory",
    },

    category: {
      type: String,
      enum: [
        "wedding",
        "childhood",
        "grandparents",
        "family",
      ],
      required: true,
      default: "family",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model<IPhoto>("Photo", photoSchema);

export default Photo;