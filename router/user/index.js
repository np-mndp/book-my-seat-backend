import express from "express";

import { User } from "../../configs/dbConfig.js";
import { generateToken } from "../../utils/jwtUtils.js";
import { authenticate } from "../../middleware/auth.js";
import bcrypt from "bcrypt";

let router = express.Router();

router.get("/");

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password format
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone, profilePicture } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character",
      });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      email,
      password,
      name,
      phone,
      profilePicture,
    });
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // return res.send({ email, password });
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
