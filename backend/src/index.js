import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ====== MIDDLEWARE ======
app.use(cookieParser());

app.use(
  cors({
    origin: true, // allow Vercel frontend automatically
    credentials: true,
  })
);

// body size fix
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ====== PRODUCTION FRONTEND SERVE (optional) ======
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ====== START SERVER ======
server.listen(PORT, () => {
  console.log("✅ Server running on port:", PORT);
  connectDB();
});