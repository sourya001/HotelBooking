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
      pricePerNight: +pricePerNight, // Ensure price is a number
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
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching rooms",
      error: error.message,
    });
  }
};

//api to get all rooms for a hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel({ owner: req.auth.userId });
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate(
      "hotel"
    );
    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching rooms",
      error: error.message,
    });
  }
};

//api to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({
      success: true,
      message: `Room is now ${
        roomData.isAvailable ? "available" : "not available"
      }`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error toggling room availability",
      error: error.message,
    });
  }
};
