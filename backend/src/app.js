import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

import authRoutes from "./routes/auth.route.js";
import serviceRoutes from "./routes/service.route.js";
import providerRoutes from "./routes/provider.route.js";
import slotRoutes from "./routes/slot.route.js";
import bookingRoutes from "./routes/booking.route.js";

app.get("/", (req, res) => {
  res.send("Appointment Booking Backend Running 🚀");
});

import slotLockRoutes from "./routes/slotLock.route.js";
app.use("/api/slots", slotLockRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
