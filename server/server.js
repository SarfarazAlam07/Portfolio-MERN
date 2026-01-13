const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Local Imports
const connectDatabase = require("./config/database");
const user = require("./routes/userRoutes");
const skill = require("./routes/skillRoutes");
const project = require("./routes/projectRoutes");
const contact = require("./routes/contactRoutes");

// 1. Config Setup
dotenv.config({ path: "./.env" });

const app = express();

// 2. Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// 3. CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // Local testing ke liye
      "https://sarfarazalam.vercel.app/" 
    ],
    credentials: true, // Cookies allowed (Login ke liye zaroori)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 4. Request Parsing
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Logging (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

// 6. Database Connection
connectDatabase();

// 7. Routes
app.use("/api/v1/user", user);
app.use("/api/v1/skill", skill);
app.use("/api/v1/project", project);
app.use("/api/v1/contact", contact);

// 8. Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio Backend Server is Running 🚀",
    version: "1.0.0",
    endpoints: {
      user: "/api/v1/user",
      skills: "/api/v1/skill",
      projects: "/api/v1/project",
      contact: "/api/v1/contact"
    }
  });
});

// 9. Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// 10. Admin Initialization
const initAdmin = async () => {
  try {
    const User = require("./models/User");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("⚠️ .env file me ADMIN_EMAIL ya ADMIN_PASSWORD missing!");
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        about: {
          name: "Sarfaraz",
          title: "Full Stack Developer",
          subtitle: "MERN Stack Enthusiast",
          description: "I build scalable web applications.",
          avatar: { url: "https://placehold.co/500x500" },
        },
      });
      console.log(`✅ Admin Created: ${adminEmail}`);
    } else {
      console.log(`✅ Admin already exists: ${adminEmail}`);
      
      // Optional: Update admin password if changed in .env
      if (adminExists.password !== adminPassword) {
        adminExists.password = adminPassword;
        await adminExists.save();
        console.log(`🔄 Admin password updated`);
      }
    }
  } catch (error) {
    console.log("❌ Admin Check Error:", error.message);
  }
};

initAdmin();

// 11. 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// 12. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: "CORS Error: Origin not allowed"
    });
  }
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 13. Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});
