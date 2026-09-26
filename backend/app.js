import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import user from "./routes/userRoutes.js";
import classs from "./routes/classRoutes.js";
import category from "./routes/categoryRoute.js";
import course from "./routes/courseRoutes.js";
import payment from "./routes/paymentRoutes.js";
import errorhandler from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve local media uploads
app.use("/upload", express.static(path.resolve("upload")));

// API v1 Routes
app.use("/api/v1", user);
app.use("/api/v1", category);
app.use("/api/v1", classs);
app.use("/api/v1", course);
app.use("/api/v1", payment);

// Centralized Error Handling Middleware
app.use(errorhandler);

export default app;
