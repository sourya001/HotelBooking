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
import stripeWebHooks from "./controllers/StripeWebhooks.js";


hotelRouter;
connectDB(); // Connect to MongoDB
connectCloudinary(); // Connect to Cloudinary
// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hotel-booking-frontend.vercel.app",
    "https://hotel-booking-nine-mu.vercel.app",
    // Allow any Vercel preview URLs for this project
    /^https:\/\/hotel-booking-.*\.vercel\.app$/,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Log CORS requests for debugging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`Request from origin: ${origin}`);
  next();
});

app.use(cors(corsOptions)); // Enable CORS for all routes

// API to listen to stripe webhooks (needs raw body)
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebHooks
);

// API to listen to Clerk webhooks (needs raw body for signature verification)
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(express.json()); // Parse JSON bodies

// Middleware for Clerk authentication
app.use(clerkMiddleware()); // Use Clerk middleware for authentication
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/user", userRouter); // Add user routes
app.use("/api/hotels", hotelRouter); // Add hotel routes
app.use("/api/rooms", roomRouter); // Add room routes
app.use("/api/bookings", bookingRouter); // Add booking routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
// This file sets up the Express server, connects to MongoDB, and configures routes for user data retrieval and Clerk webhooks.
