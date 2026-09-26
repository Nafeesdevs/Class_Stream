import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config({ path: "backend/config/config.env" });

const PORT = process.env.BACKEND_PORT || process.env.PORT || 8000;

connectDB();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shutting down due to uncaught Exception");
  process.exit(1);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shutting down due to unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});

export default server;
