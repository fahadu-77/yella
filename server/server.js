import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js'
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://yella-store.vercel.app", 
];

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

connectDB();
app.use("/api/auth", authRoutes);
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/users',userRoutes)

const PORT = 3000;
app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
