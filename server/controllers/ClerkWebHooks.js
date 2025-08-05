import User from "../models/User.js";
import pkg from "svix";
const { Webhook } = pkg;

const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    //getting the headers from the request
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //verifying headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting data from request body
    const { data, type } = req.body;
    
    console.log("Webhook received:", type, "for user:", data.id);

    //switch case to handle different webhook events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "unknown@email.com",
          username: (data.first_name && data.last_name) 
            ? `${data.first_name} ${data.last_name}` 
            : data.username || "Unknown User",
          image: data.image_url || "",
        };
        console.log("Creating user:", userData);
        await User.create(userData);
        console.log("User created successfully");
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "unknown@email.com",
          username: (data.first_name && data.last_name) 
            ? `${data.first_name} ${data.last_name}` 
            : data.username || "Unknown User",
          image: data.image_url || "",
        };
        console.log("Updating user:", data.id);
        await User.findByIdAndUpdate(data.id, userData);
        console.log("User updated successfully");
        break;
      }
      case "user.deleted": {
        console.log("Deleting user:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("User deleted successfully");
        break;
      }
      default:
        console.log("Unhandled webhook event:", type);
        break;
    }
    res.json({ success: true, message: "Webhook handled successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default clerkWebhooks;
// This function handles Clerk webhooks for user creation, update, and deletion events.
// It verifies the webhook signature and processes the user data accordingly.
