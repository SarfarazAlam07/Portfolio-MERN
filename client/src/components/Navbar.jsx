import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Menu items
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-bg/70 backdrop-blur-lg border-b border-borderColor/50 transition-all duration-300 ">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo - Gradient & Modern Font */}
        <div className="text-2xl font-extrabold tracking-tight text-primary cursor-pointer select-none">
          Port
          <span className="text-textMain">
            folio<span className="text-primary">.</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative group text-sm font-medium text-textMuted hover:text-primary transition-colors duration-300"
            >
              {link.name}
              {/* Animated Underline */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}

          {/* Theme Toggle Button - Tactile Feel */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-card border border-borderColor/50 text-textMain hover:border-primary/50 hover:text-primary transition-all active:scale-90 shadow-sm"
          >
            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-card/50 border border-borderColor/30 text-textMain active:scale-90 transition-transform"
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-textMain p-1 active:scale-90 transition-transform"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Premium Overlay style) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-bg/95 backdrop-blur-xl border-b border-borderColor/50 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col items-center py-8 gap-6">
              {navLinks.map((link, index) => (
                <motion.a
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-textMain hover:text-primary tracking-wide transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
