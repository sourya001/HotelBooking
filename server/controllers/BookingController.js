// Function to check availability of a room
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodemailer.js";
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  // Validate input
  // Logic to check room availability
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0; // If no bookings found, room is available
    return isAvailable;
  } catch (error) {
    console.error("Error checking availability:", error);
  }
};

// API endpoint to check room availability
// POST /api/booking/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({
      success: false,
      message: "Error checking availability" || error.message,
    });
  }
};

// API to create a booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id; // Assuming user ID is stored in req.user

    // Before creating a booking, check if the room is available

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available for the selected dates.",
      });
    }

    //get total price calculation for room booking
    const roomData = await Room.findById(room).populate("hotel");

    let totalPrice =
      roomData.pricePerNight *
      Math.ceil(
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
      );
    const booking = new Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      guests: +guests, // Ensure guests is a number
      totalPrice,
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Booking Confirmation",
      text: `Your booking for ${roomData.name} has been confirmed! Check-in: ${checkInDate}, Check-out: ${checkOutDate}. Total Price: ${totalPrice}`,
    });

    res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error creating booking" || error.message,
    });
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id; // Assuming user ID is stored in req.user
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching user bookings" || error.message,
    });
  }
};

// API to get all bookings for an admin
// GET /api/bookings/admin
export const getAllBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.user._id });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found for the authenticated user.",
      });
    }
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );
    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching bookings" || error.message,
    });
  }
};
