// Function to check availability of a room
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Stripe from "stripe";
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
      message: error.message || "Error checking availability",
    });
  }
};

// API to create a booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    console.log("Booking request received:", req.body);
    console.log("User from auth:", req.user);
    
    const { room, checkInDate, checkOutDate, guests, paymentMethod } = req.body;
    const user = req.user._id; // Assuming user ID is stored in req.user

    // Validate required fields
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.json({
        success: false,
        message: "Missing required booking information",
      });
    }

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
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      guests: +guests, // Ensure guests is a number
      totalPrice,
      paymentMethod: paymentMethod || "Pay On Arrival",
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Booking Confirmation",
      text: `Your booking for ${roomData.roomType} at ${roomData.hotel.name} has been confirmed! Check-in: ${checkInDate}, Check-out: ${checkOutDate}. Total Price: $${totalPrice}`,
    });

    res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.json({
      success: false,
      message: error.message || "Error creating booking",
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
      message: error.message || "Error fetching user bookings",
    });
  }
};

// API to get all bookings for an admin
// GET /api/bookings/admin
export const getAllBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found for the authenticated user.",
      });
    }
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashBoardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Error fetching bookings",
    });
  }
};

export const stripePayments = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.json({
        success: false,
        message: "Booking ID is required",
      });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }
    
    const roomData = await Room.findById(booking.room).populate("hotel");
    if (!roomData) {
      return res.json({
        success: false,
        message: "Room not found",
      });
    }
    
    const totalPrice = booking.totalPrice;

    const { origin } = req.headers;

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${roomData.hotel.name} - ${roomData.roomType}`,
            description: `Check-in: ${booking.checkInDate.toDateString()}, Check-out: ${booking.checkOutDate.toDateString()}`,
          },
          unit_amount: totalPrice * 100, // Convert to cents
        },
        quantity: 1,
      },
    ];

    //create a checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId: bookingId.toString(),
      },
    });
    
    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res.json({
      success: false,
      message: "Error creating Stripe checkout session",
    });
  }
};
