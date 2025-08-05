import User from "../models/User.js";

//Middleware to check if the user is authenticated
export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.json({
        success: false,
        message: "You are not authenticated",
      });
    }
    
    let user = await User.findById(userId);
    
    // If user doesn't exist in database, create them
    if (!user) {
      // This is a fallback in case the webhook didn't create the user
      user = await User.create({
        _id: userId,
        email: req.auth.sessionClaims?.email || "unknown@email.com",
        username: req.auth.sessionClaims?.username || "Unknown User",
        image: req.auth.sessionClaims?.image_url || "",
        role: "user",
        recentSearchedCities: []
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.json({
      success: false,
      message: "Authentication failed",
    });
  }
};
