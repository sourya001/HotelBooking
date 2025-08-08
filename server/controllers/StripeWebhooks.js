import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripeWebHooks = async (req, res) => {
  // stripe gateway initialization
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { bookingId } = session.metadata;

    // Update booking status to paid
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });
    
    console.log(`Payment completed for booking: ${bookingId}`);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};

export default stripeWebHooks;
