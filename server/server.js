import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000", // For local testing
  "https://your-project-name.vercel.app", // Replace this later with your actual Vercel URL
];

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // You're on the list!
      } else {
        callback(new Error("Not allowed by CORS")); // Go away!
      }
    },
    credentials: true,
  }),
);

connectDB();
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
