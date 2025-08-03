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

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    //switch case to handle different webhook events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }
      case "user.updated": {
        await User.findByIdAndUpdate(data._id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data._id);
        break;
      }
      default:
        break;
    }
    res.json({ success: true, message: "Webhook handled successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default clerkWebhooks;
// This function handles Clerk webhooks for user creation, update, and deletion events.
// It verifies the webhook signature and processes the user data accordingly.