const Skill = require("../models/Skill");

// 1. Add New Skill (EXISTING)
exports.addSkill = async (req, res) => {
  try {
    const { name, percentage, image } = req.body;

    if (!name || !percentage || !image) {
      return res.status(400).json({
        success: false,
        message: "Please enter Name, Percentage & Image URL",
      });
    }

    await Skill.create({
      name,
      percentage,
      image: { url: image },
    });

    res.status(201).json({
      success: true,
      message: "New Skill Added Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Skills (EXISTING)
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. ✅ UPDATE SKILL FUNCTION (NEW)
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, percentage, image } = req.body;

    if (!name || !percentage) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and percentage",
      });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      {
        name,
        percentage,
        image: { url: image || "" },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    console.error("Update Skill Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating skill",
      error: error.message,
    });
  }
};

// 4. Delete Skill (EXISTING)
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ 
        success: false, 
        message: "Skill not found" 
      });
    }
    await skill.deleteOne();
    res.status(200).json({
      success: true,
      message: "Skill Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};