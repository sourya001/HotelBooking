import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
connectDB(); // Connect to MongoDB

// Initialize Express app
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Middleware for Clerk authentication
app.use(clerkMiddleware()); // Use Clerk middleware for authentication

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
