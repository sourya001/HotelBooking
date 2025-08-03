import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary.js";
import Room from "../models/Room.js";
//api to create a new room for a hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "No hotel found for this user",
      });
    }
    // upload images to Cloudinary
    const uploadedImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });
    const images = await Promise.all(uploadedImages);
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });
    res.json({
      success: true,
      message: "Room created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error creating room",
      error: error.message,
    });
  }
};
//api to get all rooms
export const getRooms = async (req, res) => {};
//api to get all rooms for a hotel
export const getOwnerRooms = async (req, res) => {};
//api to toggle room availability
export const toggleRoomAvailability = async (req, res) => {};
