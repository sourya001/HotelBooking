import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getRooms, getOwnerRooms, toggleRoomAvailability } from "../controllers/RoomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), protect, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);
export default roomRouter;
// This file defines the room routes for creating a room with image uploads.
// It uses the upload middleware to handle file uploads and the protect middleware to ensure that only authenticated users can access the route.
