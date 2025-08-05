import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchCities } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchCities);

export default userRouter;
// This file defines the user routes for retrieving user data.
// It uses the protect middleware to ensure that only authenticated users can access the route.
