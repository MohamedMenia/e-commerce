import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-advanced";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db";
import limiter from "./config/limiter";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_ALLOWED_ORIGIN,
    credentials: true,
  })
);

// Set security HTTP headers
app.use(helmet());

// Limit repeated requests to public APIs
app.use(limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Parse JSON request body and limit request size
app.use(
  express.json({
    limit: "10kb",
  })
);
// Use cookie-parser middleware
app.use(cookieParser());
// Routes
app.use("/user", userRoute);
// Global error handler
app.use(globalErrorHandler);

// Database connection
connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error(err.name, err.message);
      console.error("Unhandled rejection occurred! Shutting down...");
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
