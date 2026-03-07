import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";

import reservationRouter from "./routes/reservationRoute.js";
import authRouter from "./routes/authRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import menuRouter from "./routes/menuRoute.js";

const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });

/*
----------------------------------------
CORS CONFIGURATION
----------------------------------------
Allow:
1. Local development
2. Main Vercel domain
3. Any Vercel preview deployment
*/

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://restaurant-eosin-pi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Allow listed domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel preview deployment
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
----------------------------------------
API ROUTES
----------------------------------------
*/

app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/menu", menuRouter);

/*
----------------------------------------
DATABASE CONNECTION
----------------------------------------
*/

dbConnection();

/*
----------------------------------------
ERROR HANDLER
----------------------------------------
*/

app.use(errorMiddleware);

export default app;