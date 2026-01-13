const Project = require("../models/Project");

// 1. ADD PROJECT (EXISTING)
exports.addProject = async (req, res) => {
  try {
    const { title, description, techStack, gitHubLink, projectLink, image } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter Title, Desc & Image URL" 
      });
    }

    await Project.create({
      title,
      description,
      techStack,
      gitHubLink,
      projectLink,
      image: { url: image },
    });

    res.status(201).json({
      success: true,
      message: "Project Added Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET ALL PROJECTS (EXISTING)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ 
      success: true, 
      projects 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 3. ✅ UPDATE PROJECT FUNCTION (NEW)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, techStack, gitHubLink, projectLink, image } = req.body;

    if (!title || !description || !techStack) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description and tech stack",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        techStack,
        gitHubLink: gitHubLink || "",
        projectLink: projectLink || "",
        image: { url: image || "" },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating project",
      error: error.message,
    });
  }
};

// 4. DELETE PROJECT (EXISTING)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }

    await project.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Project Deleted Successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};