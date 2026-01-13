const express = require("express");
const { contactUs } = require("../controllers/contactController");

const router = express.Router();

// Kya yahan "/send" likha hai?
router.post("/send", contactUs);  // <--- Ye "/send" hona chahiye

module.exports = router;