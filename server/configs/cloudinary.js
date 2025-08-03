import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default connectCloudinary;
// This module configures Cloudinary with the credentials from environment variables.
// It exports a function to connect to Cloudinary, which can be called in the server setup to ensure Cloudinary is ready for use.
