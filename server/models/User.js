const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [false, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    select: false,
  },
  // 👇 Ab Resume bas ek Link hoga (Google Drive / Dropbox link)
  resume: {
    url: { type: String, default: "" },
  },
  about: {
    name: { type: String, default: "Sarfaraz" },
    title: { type: String, default: "Hi, I am" },
    subtitle: { type: String, default: "Full Stack Developer" },
    description: { type: String, default: "I build things." },
    roles: {
      type: [String],
      default: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
    },
    // 👇 Avatar ab bas ek String URL hai
    avatar: {
      url: { type: String, default: "https://placehold.co/500x500" },
    },
  },
  role: {
    type: String,
    default: "user",
  },
});

// 1. Password Hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// 2. Password Compare
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3. JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

module.exports = mongoose.model("User", userSchema);
