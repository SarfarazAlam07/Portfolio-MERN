import React from "react";
import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiTwitter,
  FiHeart,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-borderColor py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Brand (Left) & Socials (Right) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          {/* Left: TechEarX Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-textMain tracking-tight flex items-center gap-1">
              TechEra
              <span className="text-red-500 text-3xl leading-none">X</span>
            </h2>
            <p className="text-xs text-textMuted font-medium tracking-wide uppercase">
              Web & App Development
            </p>
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: FiGithub, href: "https://github.com/SarfarazAlam07" },
              {
                icon: FiLinkedin,
                href: "https://www.linkedin.com/in/sarfaraz-alam-92b364276/",
              },
              { icon: FiTwitter, href: "https://x.com/SarfarazAlam01" },
              {
                icon: FiInstagram,
                href: "https://www.instagram.com/mdsarfaraz5231?igsh=MTVhd3RrYTNjZm9kYg==",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-textMuted hover:text-primary transition-colors duration-300"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-borderColor/50 mb-4"></div>

        {/* Bottom Section: Copyright & Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-textMuted gap-2">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-textMain">TechEraX</span>. All
            Rights Reserved.
          </p>

          <p className="flex items-center gap-1">
            Designed&Developed by{" "}
            <span className="text-textMain font-bold">Sarfaraz</span>
            <FiHeart className="text-red-500 fill-red-500" size={10} />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
