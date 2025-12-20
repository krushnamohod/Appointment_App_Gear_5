import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { createServer } from "http";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { initializeSocket } from "./services/socketService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

dotenv.config();

const app = express();

// Create HTTP server for Socket.IO
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
  ],
  credentials: true
}));
app.use(morgan("dev"));

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Request Body Logger
app.use((req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "***";
    console.log("📦 Request Body:", JSON.stringify(sanitizedBody, null, 2));
  }
  next();
});

import authRoutes from "./routes/auth.route.js";
import bookingRoutes from "./routes/booking.route.js";
import providerRoutes from "./routes/provider.route.js";
import serviceRoutes from "./routes/service.route.js";
import slotRoutes from "./routes/slot.route.js";
// import chatbotRoutes from "./routes/chatbot.route.js";

app.get("/", (req, res) => {
  res.send("Appointment Booking Backend Running 🚀 (with Socket.IO + AI Chat)");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
// app.use("/api/chat", chatbotRoutes);

import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use(errorMiddleware); // Error handler must be last

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT} (Socket.IO enabled)`)
);
