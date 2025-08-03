import express from "express";
import { protect } from "../middleware/authMiddleware";
import { registerHotel } from "../controllers/HotelController";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);

export default hotelRouter;
// This file defines the hotel routes for registering a hotel.
// It uses the protect middleware to ensure that only authenticated users can access the route.
