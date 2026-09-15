import { adminAuth } from "../config/firebase.js";
import User from "../models/User.js";
import { sendTokenCookie, clearTokenCookie } from "../utils/token.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    sendTokenCookie(res, user._id);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendTokenCookie(res, user._id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Firebase authentication token is required" });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken || !decodedToken.email) {
      return res.status(400).json({ message: "Unable to retrieve email from Google account" });
    }

    const { uid, email, name } = decodedToken;

    let user = await User.findOne({
      $or: [{ email }, { firebaseUid: uid }, { googleId: uid }],
    });

    if (user) {
      let updated = false;
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        updated = true;
      }
      if (!user.googleId) {
        user.googleId = uid;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId: uid,
        firebaseUid: uid,
      });
    }

    sendTokenCookie(res, user._id);
    res.json({ user });
  } catch (err) {
    console.error("Firebase auth error:", err.code || err.name, err.message);
    if (
      err.code?.startsWith?.("auth/") ||
      (err.message &&
        (err.message.includes("Decoding Firebase ID token failed") ||
          err.message.includes("expired") ||
          err.message.includes("incorrect") ||
          err.message.includes("invalid")))
    ) {
      return res.status(401).json({
        message: err.message || "Invalid or expired Firebase authentication token",
      });
    }
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.userId },
    });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered by another user" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    await user.save();

    res.json({ user, message: "Profile updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user has an existing password set, verify currentPassword
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
