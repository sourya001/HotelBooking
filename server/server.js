import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/ClerkWebHooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
hotelRouter;
connectDB(); // Connect to MongoDB
connectCloudinary(); // Connect to Cloudinary
// Initialize Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://hotel-booking-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
})); // Enable CORS for all routes

// Raw body parser for webhooks (must be before express.json())
app.use("/api/clerk", express.raw({ type: "application/json" }));
app.use(express.json()); // Parse JSON bodies

// Middleware for Clerk authentication
app.use(clerkMiddleware()); // Use Clerk middleware for authentication

//api to listen to Clerk webhooks
app.post("/api/clerk", clerkWebhooks);
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/user", userRouter); // Add user routes
app.use("/api/hotels", hotelRouter); // Add hotel routes
app.use("/api/rooms", roomRouter); // Add room routes
app.use("/api/bookings", bookingRouter); // Add booking routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
// This file sets up the Express server, connects to MongoDB, and configures routes for user data retrieval and Clerk webhooks.
