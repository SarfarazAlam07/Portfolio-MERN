const express = require("express");
const { 
  addProject, 
  getProjects, 
  deleteProject,
  updateProject  // ✅ ADD THIS IMPORT
} = require("../controllers/projectController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// ✅ ADD UPDATE ROUTE
router.put("/:id", isAuthenticated, updateProject);

// Existing routes
router.post("/add", isAuthenticated, addProject);
router.delete("/:id", isAuthenticated, deleteProject);
router.get("/all", getProjects);

module.exports = router;