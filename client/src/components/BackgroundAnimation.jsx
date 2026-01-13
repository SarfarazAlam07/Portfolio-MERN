import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  const codeLines = [
    "const project = new Project();",
    "function buildPortfolio() {",
    "  return <AwesomeWebsite />;",
    "}",
    "npm start // 🚀",
    "console.log('Building...');",
    "import React from 'react';",
    "export default App;",
    "// Portfolio by Sarfaraz",
    "git push origin main",
    "const techStack = ['React', 'Node', 'MongoDB'];",
    "API.get('/projects')",
    "tailwind.config.js",
    "const success = true;",
    "🚀 Deploying...",
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {codeLines.map((line, index) => (
        <motion.div
          key={index}
          className="absolute text-xs sm:text-sm font-mono text-primary/10 dark:text-primary/5 whitespace-nowrap"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: `-${window.innerHeight + 100}px`,
            opacity: [0, 0.6, 0],
            x: Math.random() * 50 - 25,
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            delay: index * 2,
            ease: "linear",
          }}
        >
          {line}
        </motion.div>
      ))}

      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-primary/10 dark:bg-primary/5 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, `-${window.innerHeight + 100}px`],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;