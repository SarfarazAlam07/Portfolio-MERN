const express = require("express");
const {
  login,
  logout,
  getUser,
  updateResume,
  updateProfile,
  downloadResume,
} = require("../controllers/userController"); // Sahi functions import kiye

const { isAuthenticated } = require("../middlewares/auth"); // Middleware import

const router = express.Router();

// 1. Auth Routes
router.post("/login", login);
router.get("/logout", logout);

// 2. Get User Data (Isi se Dashboard ka data milega)
router.get("/me", getUser);

// 3. Updates (Sirf Logged in user/Admin kar sakta hai)
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/resume/update", isAuthenticated, updateResume);
router.get("/admin/check", isAuthenticated, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// 4. Download Resume
router.get("/resume/download", downloadResume);

// ❌ router.get("/dashboard"...) // Ye line hata di kyunki 'getDashboard' function nahi hai

module.exports = router;
