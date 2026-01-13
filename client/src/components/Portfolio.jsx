import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiFolder, FiCode } from "react-icons/fi";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BACKEND_URL}/api/v1/project/all`);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [BACKEND_URL]);

  // Helper functions
  const getProjectImage = (image) => {
    if (!image)
      return "https://placehold.co/600x400/1a1a2e/00adb5?text=Project";
    if (typeof image === "string") return image;
    if (image.url) return image.url;
    return "https://placehold.co/600x400/1a1a2e/00adb5?text=Project";
  };

  const trimDescription = (desc) => {
    if (!desc) return "No description";
    if (desc.length <= 60) return desc;
    return desc.substring(0, 60) + "...";
  };

  return (
    <section
      id="projects"
      className="py-10 px-4 sm:px-6 bg-card/30 text-textMain relative overflow-hidden"
    >
      {/* Minimal Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
            <FiCode className="w-3 h-3" />
            My Work
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Projects</h2>
          <p className="text-textMuted text-sm max-w-lg mx-auto">
            Recent work showcasing my skills
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-pulse"
              >
                <div className="pt-[60%] bg-white/10 rounded-lg mb-3"></div>
                <div className="h-3 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-white/10 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2 mb-2">
                  <div className="h-5 bg-white/10 rounded-full w-12"></div>
                  <div className="h-5 bg-white/10 rounded-full w-14"></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="h-8 bg-white/10 rounded-lg flex-1"></div>
                  <div className="h-8 bg-white/10 rounded-lg flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Projects Grid - Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                >
                  {/* Image - Smaller */}
                  <div className="relative pt-[60%] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                    <img
                      src={getProjectImage(project.image)}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/600x400/1a1a2e/00adb5?text=Project";
                        e.target.className =
                          "absolute inset-0 w-full h-full object-contain p-3";
                      }}
                    />
                    <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiFolder className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Content - Compact */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-textMain mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    {/* Tech Stack - Single line */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.techStack
                        ?.split(",")
                        .slice(0, 2)
                        .map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      {project.techStack?.split(",").length > 2 && (
                        <span className="text-xs px-1.5 py-0.5 bg-white/10 text-textMuted rounded">
                          +{project.techStack.split(",").length - 2}
                        </span>
                      )}
                    </div>

                    {/* Description - Shorter */}
                    <p className="text-textMuted text-xs leading-relaxed line-clamp-2 mb-3">
                      {trimDescription(project.description)}
                    </p>

                    {/* Buttons - Smaller */}
                    <div className="flex gap-2 pt-3 border-t border-white/10">
                      <a
                        href={project.gitHubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-textMain hover:text-primary transition-all text-xs font-medium"
                      >
                        <FiGithub className="w-3 h-3 flex-shrink-0" />
                        <span>Code</span>
                      </a>

                      {project.projectLink && (
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-gradient-to-r from-primary to-secondary text-white hover:shadow-sm transition-all text-xs font-medium"
                        >
                          <FiExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State - Compact */}
            {!loading && projects.length === 0 && (
              <div className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiFolder className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-textMain mb-1">No Projects</h3>
                <p className="text-textMuted text-sm">
                  Add projects from admin panel
                </p>
              </div>
            )}
          </>
        )}

        {/* Stats Footer - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs text-textMuted">Total:</span>
            <span className="text-sm font-bold text-primary">
              {projects.length}
            </span>
            <span className="text-xs text-textMuted">projects</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
