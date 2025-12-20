import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import { sendOTPEmail, generateOTP } from "../services/email.service.js";
import redis from "../utils/redis.js";

// Regular signup (for admin/organiser - no OTP)
export async function signup(req, res) {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  res.status(201).json({ message: "Signup successful" });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
}

// Send OTP to email
export async function sendOTP(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();

    // Store OTP in Redis with 5 minute expiry
    await redis.setex(`otp:${email}`, 300, otp);

    // Send email
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
}

// Verify OTP
export async function verifyOTP(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const storedOTP = await redis.get(`otp:${email}`);

    if (!storedOTP) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark email as verified in Redis (for signup flow)
    await redis.setex(`verified:${email}`, 600, "true");
    await redis.del(`otp:${email}`);

    res.json({ message: "Email verified successfully", verified: true });
  } catch (error) {
    next(error);
  }
}

// Customer signup with OTP verification
export async function signupWithOTP(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if email was verified
    const isVerified = await redis.get(`verified:${email}`);
    if (!isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "CUSTOMER" },
    });

    // Clean up verification flag
    await redis.del(`verified:${email}`);

    // Auto-login after signup
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
}

// Login with OTP (passwordless)
export async function loginWithOTP(req, res, next) {
  try {
    const { email, otp } = req.body;

    const storedOTP = await redis.get(`otp:${email}`);

    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await redis.del(`otp:${email}`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
}
// Update Profile
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, avatar },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Profile updated successfully", user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
}
