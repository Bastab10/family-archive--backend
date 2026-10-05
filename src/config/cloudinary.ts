import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config:");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key loaded:", process.env.CLOUDINARY_API_KEY ? "YES" : "NO");
console.log(
  "API secret loaded:",
  process.env.CLOUDINARY_API_SECRET ? "YES" : "NO"
);

export default cloudinary;