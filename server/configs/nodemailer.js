import nodemailer from "nodemailer";

// Create a transporter object using the default SMTP transport
// Ensure you have the necessary environment variables set in your .env file

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
 