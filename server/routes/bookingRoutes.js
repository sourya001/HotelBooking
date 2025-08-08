import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getAllBookings,
  stripePayments,
} from "../controllers/BookingController.js";
import { protect } from "../middleware/authMiddleware.js";

// Create a router for booking-related routes
const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getAllBookings);
bookingRouter.post("/stripe-payments", protect, stripePayments);
export default bookingRouter;
