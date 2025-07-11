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