import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  googleLogin,
  updateMe,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/password", protect, updatePassword);

export default router;
