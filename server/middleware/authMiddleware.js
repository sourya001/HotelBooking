import User from "../models/User";

//Middleware to chech if the user is authenticated
export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    res.json({
      success: false,
      message: "You are not authenticated",
    });
  } else {
    const user = await User.findById(userId);
    req.user = user;
    next();
  }
};
