const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 1. LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter email & password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist!" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password!" });
    }

    const token = user.getJWTToken();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 Days
        sameSite: "none", // Cross-site ke liye important (agar frontend alag port pe hai)
        secure: true, // HTTPS ke liye (localhost pe bhi chalta hai modern browsers me)
      })
      .json({
        success: true,
        message: `Welcome Back, ${user.email}!`,
        user,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LOGOUT
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET USER (Public Portfolio Data)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne().select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE PROFILE (Name, Bio, Avatar URL)
exports.updateProfile = async (req, res) => {
  try {
    // Default admin user ko dhund rahe hain
    const user = await User.findOne();

    // Frontend se ye data aayega
    const { name, title, subtitle, description, roles, avatar } = req.body;

    if (name) user.about.name = name;
    if (title) user.about.title = title;
    if (subtitle) user.about.subtitle = subtitle;
    if (description) user.about.description = description;
    if (avatar) user.about.avatar.url = avatar; // 👈 Direct URL Update

    // Roles Logic (Comma separated string to Array)
    if (roles && typeof roles === "string") {
      user.about.roles = roles.split(",").map((role) => role.trim());
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. UPDATE RESUME (URL Method)
exports.updateResume = async (req, res) => {
  try {
    const user = await User.findOne();
    const { resume } = req.body; // 👈 Frontend se URL aayega

    if (!resume) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a Resume URL" });
    }

    user.resume.url = resume;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume URL Updated Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. DOWNLOAD RESUME (Redirect to URL)
exports.downloadResume = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user || !user.resume || !user.resume.url) {
      return res.status(404).json({ message: "Resume URL not found" });
    }
    // Seedha URL bhej do, frontend usse new tab me khol lega
    res.status(200).json({ url: user.resume.url });
  } catch (error) {
    res.status(500).send("Error fetching resume");
  }
};
