const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter project title"],
  },
  description: {
    type: String,
    required: [true, "Please enter project description"],
  },
  techStack: {
    type: String, // "React, Node, Mongo"
    required: true,
  },
  gitHubLink: {
    type: String,
    required: true,
  },
  projectLink: {
    type: String, // Live Demo Link
  },
  // 👇 Image ab simple URL string hai
  image: {
    url: { type: String, required: true },
  },
});

module.exports = mongoose.model("Project", projectSchema);
