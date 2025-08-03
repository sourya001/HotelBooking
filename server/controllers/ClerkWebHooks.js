import User from "../models/User.js";
import { WebHook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with clerk webhook secret
    const whook = new WebHook(process.env.CLERK_WEBHOOK_SECRET);
    //getting the headers from the request
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //verifying headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting data from request body
    const { type, data } = req.body;
  } catch (error) {}
};
