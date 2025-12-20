import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
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
import serviceRoutes from "./routes/service.route.js";
import providerRoutes from "./routes/provider.route.js";
import slotRoutes from "./routes/slot.route.js";
import bookingRoutes from "./routes/booking.route.js";

app.get("/", (req, res) => {
  res.send("Appointment Booking Backend Running 🚀");
});


// import slotLockRoutes from "./routes/slotLock.route.js"; // Consolidating slot routes
// app.use("/api/slots", slotLockRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use(errorMiddleware); // Error handler must be last

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
