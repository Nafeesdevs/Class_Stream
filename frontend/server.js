import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import appModule from "../backend/app.js";
import { connectDB } from "../backend/config/db.js";

dotenv.config({ path: "../backend/config/config.env" });
dotenv.config();

const app = appModule.default ?? appModule;
const PORT = 3000;

async function startServer() {
  // Connect to database and seed initial platform data
  await connectDB();

  // In development mode, mount Vite middleware to serve client SPA
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static assets
    const distPath = path.resolve("dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Class Stream platform is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Class Stream server:", err);
});
