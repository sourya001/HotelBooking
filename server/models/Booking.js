import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true }, // Reference to the user who made the booking
    room: { type: String, ref: "Room", required: true }, // Reference to the room being booked
    hotel: { type: String, ref: "Hotel", required: true }, // Reference to the hotel being booked
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Pay On Arrival",
    },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
// This model defines the schema for a booking, including its hotel, room type, price per night, amenities, images, and availability status. It uses Mongoose to interact with MongoDB.
