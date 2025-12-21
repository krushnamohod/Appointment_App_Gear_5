// Node server entry point - triggered restart
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { initializeSocket } from "./services/socketService.js";

dotenv.config();

const app = express();

// Create HTTP server for Socket.IO
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

app.use(express.json());
app.use("/uploads", express.static("uploads"));
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
import discountRoutes from "./routes/discount.route.js";
import paymentRoutes from "./routes/payment.route.js";

import providerRoutes from "./routes/provider.route.js";
import reportRoutes from "./routes/report.route.js";
import resourceRoutes from "./routes/resource.route.js";
import serviceRoutes from "./routes/service.route.js";
import slotRoutes from "./routes/slot.route.js";
import uploadRoutes from "./routes/upload.route.js";
import userRoutes from "./routes/user.route.js";

app.get("/", (req, res) => {
  res.send("Appointment Booking Backend Running 🚀 (with Socket.IO)");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

app.use("/api/providers", providerRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/discounts", discountRoutes);

import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use(errorMiddleware); // Error handler must be last

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT} (Socket.IO enabled)`)
);
