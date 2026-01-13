const express = require("express");
const { 
  addSkill, 
  getSkills, 
  deleteSkill,
  updateSkill  // ✅ ADD THIS IMPORT
} = require("../controllers/skillController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// ✅ ADD UPDATE ROUTE
router.put("/:id", isAuthenticated, updateSkill);

// Existing routes
router.post("/add", isAuthenticated, addSkill);
router.delete("/:id", isAuthenticated, deleteSkill);
router.get("/all", getSkills);

module.exports = router;