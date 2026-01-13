import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import {
  FiGithub,
  FiLinkedin,
  FiDownload,
  FiTwitter,
  FiInstagram,
  FiFileText,
} from "react-icons/fi";

const Hero = () => {
  const [resumeUrl, setResumeUrl] = useState("");

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Profile Data State
  const [userData, setUserData] = useState({
    name: "Sarfaraz",
    title: "Hi, I am",
    roles: ["Full Stack Developer", "MERN Expert"],
    description: "I build scalable web applications.",
    avatar: "https://placehold.co/500x500",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/v1/user/me`);
        if (data.user) {
          if (data.user.resume && data.user.resume.url) {
            setResumeUrl(data.user.resume.url);
          }

          if (data.user.about) {
            setUserData({
              name: data.user.about.name || "Sarfaraz",
              title: data.user.about.title || "Hi, I am",
              description: data.user.about.description || "I build things...",
              roles:
                data.user.about.roles && data.user.about.roles.length > 0
                  ? data.user.about.roles
                  : ["Full Stack Developer", "MERN Expert", "UI/UX Designer"],
              avatar:
                data.user.about.avatar?.url || "https://placehold.co/500x500",
            });
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [BACKEND_URL]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-bg transition-colors duration-300"
    >
      {/* Background Effects - Made smaller for mobile */}
      <div className="absolute top-20 right-[-50px] w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse md:right-[-10%] md:w-72 md:h-72" />
      <div className="absolute bottom-20 left-[-50px] w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000 md:left-[-10%] md:w-72 md:h-72" />

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 px-4 mx-auto">
        {/* Left Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-card border border-borderColor text-primary text-sm font-semibold tracking-wide mb-4 inline-block">
              👋 {userData.title}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-textMain mb-4 leading-tight"
          >
            {userData.name}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              .
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 h-12 sm:h-14 md:h-16"
          >
            I am a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              <Typewriter
                key={userData.roles.join("-")}
                words={userData.roles}
                loop={0}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-textMuted max-w-lg mb-8 leading-relaxed text-base md:text-lg px-4 sm:px-0"
          >
            {userData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#contact"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all font-bold text-sm sm:text-base w-full sm:w-auto text-center"
            >
              Hire Me
            </a>

            {/* Resume Button */}
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-card border border-borderColor text-textMain rounded-xl hover:bg-bg hover:border-primary/50 transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base w-full sm:w-auto"
              >
                <FiFileText /> View Resume
              </a>
            ) : (
              <button
                disabled
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-card border border-borderColor text-textMuted rounded-xl cursor-not-allowed flex items-center justify-center gap-2 font-medium opacity-50 text-sm sm:text-base w-full sm:w-auto"
              >
                <FiDownload /> Resume N/A
              </button>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex gap-4 sm:gap-6 mt-8 sm:mt-10 text-textMuted justify-center md:justify-start w-full"
          >
            {[
              { Icon: FiGithub, url: "https://github.com/SarfarazAlam07" },
              {
                Icon: FiLinkedin,
                url: "https://www.linkedin.com/in/sarfaraz-alam-92b364276/",
              },
              { Icon: FiTwitter, url: "https://x.com/SarfarazAlam01" },
              {
                Icon: FiInstagram,
                url: "https://www.instagram.com/mdsarfaraz5231?igsh=MTVhd3RrYTNjZm9kYg==",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-card border border-borderColor rounded-full hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300 active:scale-90"
              >
                <social.Icon size={18} className="sm:w-5 sm:h-5" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center order-1 md:order-2 mb-8 md:mb-0"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 m-auto w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-20 blur-2xl animate-spin-slow"></div>

            {/* Image Container */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full p-2 bg-gradient-to-br from-bg to-card border border-borderColor/50 shadow-2xl mx-auto">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-bg shadow-inner"
                onError={(e) => {
                  e.target.src = "https://placehold.co/500x500";
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
