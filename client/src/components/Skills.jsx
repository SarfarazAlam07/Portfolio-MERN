import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Grid3x3,
  List,
  X,
} from "lucide-react";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("compact");
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Skill categories based on percentage
  const skillSections = [
    {
      id: "expert",
      title: "Expert Level",
      range: [80, 100],
      icon: "🏆",
      color: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-400",
    },
    {
      id: "advanced",
      title: "Advanced",
      range: [60, 79],
      icon: "⚡",
      color: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-400",
    },
    {
      id: "intermediate",
      title: "Intermediate",
      range: [40, 59],
      icon: "📊",
      color: "from-purple-500/20 to-violet-500/20",
      textColor: "text-purple-400",
    },
    {
      id: "beginner",
      title: "Learning",
      range: [0, 39],
      icon: "🌱",
      color: "from-gray-500/20 to-slate-500/20",
      textColor: "text-gray-400",
    },
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BACKEND_URL}/api/v1/skill/all`);
        if (data.skills) {
          const sortedSkills = [...data.skills].sort(
            (a, b) => b.percentage - a.percentage
          );
          setSkills(sortedSkills);
          setFilteredSkills(sortedSkills);
        }
      } catch (error) {
        console.log("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [BACKEND_URL]);

  // Filter skills by search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSkills(skills);
      return;
    }

    const filtered = skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSkills(filtered);
  }, [searchTerm, skills]);

  // Group skills by level
  const getSkillsByLevel = (min, max) => {
    return filteredSkills.filter(
      (skill) => skill.percentage >= min && skill.percentage <= max
    );
  };

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Get section stats
  const getSectionStats = () => {
    const stats = {};
    skillSections.forEach((section) => {
      const skillsInSection = getSkillsByLevel(
        section.range[0],
        section.range[1]
      );
      stats[section.id] = skillsInSection.length;
    });
    return stats;
  };

  const sectionStats = getSectionStats();

  return (
    <section
      id="skills"
      className="py-8 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-textMain">
            Technical <span className="text-primary">Expertise</span>
          </h1>
          <p className="text-textMuted text-lg max-w-2xl mx-auto mb-8">
            Organized by proficiency level. Click on any section to explore
            skills.
          </p>

          {/* Search and Controls */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textMuted w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills (e.g., React, Node.js, MongoDB)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textMuted hover:text-textMain"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Stats Overview */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <span className="text-textMain font-medium">
                  Total Skills:{" "}
                </span>
                <span className="text-primary font-bold">{skills.length}</span>
              </div>
              {skillSections.map((section) => (
                <div
                  key={section.id}
                  className={`px-4 py-2 backdrop-blur-sm rounded-full border ${section.textColor.replace(
                    "text-",
                    "border-"
                  )}/20 cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className={`font-medium ${section.textColor}`}>
                    {sectionStats[section.id] || 0}
                  </span>
                  <span className="text-textMuted text-sm ml-2">
                    {section.title.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Skills Sections (Hamburger/Accordion Style) */}
            <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
              {skillSections.map((section) => {
                const sectionSkills = getSkillsByLevel(
                  section.range[0],
                  section.range[1]
                );
                const isExpanded = expandedSection === section.id;

                return (
                  <motion.div
                    key={section.id}
                    layout
                    className={`rounded-2xl border backdrop-blur-lg overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? `${
                            section.color
                              .replace("from-", "border-")
                              .split(" ")[0]
                          }/30 bg-gradient-to-br ${section.color} shadow-2xl`
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {/* Section Header (Always Visible) */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-4 md:px-8 md:py-6 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl ${section.textColor}`}>
                          {section.icon}
                        </div>
                        <div>
                          <h3
                            className={`text-sm font-bold ${
                              isExpanded ? "text-white" : "text-textMain"
                            }`}
                          >
                            {section.title}
                          </h3>
                          <p className="text-[14px] text-textMuted mt-1">
                            {section.range[0]}-{section.range[1]}% proficiency •{" "}
                            {sectionSkills.length} skills
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            section.textColor
                          } ${
                            section.color.replace("from-", "bg-").split(" ")[0]
                          }/20`}
                        >
                          {sectionSkills.length} skills
                        </span>
                        <div
                          className={`transform transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-textMuted" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-textMuted" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {isExpanded && sectionSkills.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                            {/* View Mode Toggle */}
                            <div className="flex justify-end mb-6">
                              <div className="flex items-center gap-2 bg-black/20 rounded-full p-1">
                                <button
                                  onClick={() => setViewMode("compact")}
                                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                    viewMode === "compact"
                                      ? "bg-primary text-white"
                                      : "text-textMuted hover:text-white"
                                  }`}
                                >
                                  <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setViewMode("detailed")}
                                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                    viewMode === "detailed"
                                      ? "bg-primary text-white"
                                      : "text-textMuted hover:text-white"
                                  }`}
                                >
                                  <List className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Skills Grid */}
                            <div
                              className={`grid gap-4 ${
                                viewMode === "compact"
                                  ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
                                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                              }`}
                            >
                              {sectionSkills.map((skill, index) =>
                                viewMode === "compact" ? (
                                  <CompactSkillCard
                                    key={skill._id}
                                    skill={skill}
                                    index={index}
                                  />
                                ) : (
                                  <DetailedSkillCard
                                    key={skill._id}
                                    skill={skill}
                                    index={index}
                                  />
                                )
                              )}
                            </div>

                            {/* No Skills Message */}
                            {sectionSkills.length === 0 && (
                              <div className="text-center py-8 text-textMuted">
                                No skills found in this category
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* All Skills Summary (Collapsed View) */}
            {expandedSection === null && filteredSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                  {filteredSkills.slice(0, 20).map((skill) => (
                    <div
                      key={skill._id}
                      className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-sm text-textMain hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
                      onClick={() => {
                        // Find which section this skill belongs to and expand it
                        const section = skillSections.find(
                          (s) =>
                            skill.percentage >= s.range[0] &&
                            skill.percentage <= s.range[1]
                        );
                        if (section) setExpandedSection(section.id);
                      }}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span className="ml-2 text-xs text-primary font-bold">
                        {skill.percentage}%
                      </span>
                    </div>
                  ))}
                  {filteredSkills.length > 20 && (
                    <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                      +{filteredSkills.length - 20} more
                    </div>
                  )}
                </div>
                <p className="text-textMuted text-sm mt-4">
                  Click on any skill or section header to view details
                </p>
              </motion.div>
            )}

            {/* Search Results Message */}
            {searchTerm && filteredSkills.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-textMuted mx-auto mb-4" />
                <h3 className="text-xl font-bold text-textMain mb-2">
                  No skills found
                </h3>
                <p className="text-textMuted">
                  Try a different search term or browse by category above
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Compact Skill Card
const CompactSkillCard = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.02 }}
    className="group flex flex-col items-center p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-primary/30 hover:bg-black/30 transition-all"
  >
    <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center p-2 mb-2">
      <img
        src={skill.image.url}
        alt={skill.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.target.src = "https://placehold.co/100x100";
          e.target.className = "w-full h-full object-contain p-1";
        }}
      />
    </div>
    <div className="text-center">
      <div className="text-xs font-medium text-textMain truncate mb-1">
        {skill.name}
      </div>
      <div className="text-xs font-bold text-primary">{skill.percentage}%</div>
    </div>
  </motion.div>
);

// Detailed Skill Card
const DetailedSkillCard = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group flex items-center p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-primary/30 hover:bg-black/30 transition-all"
  >
    <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center p-2 mr-4">
      <img
        src={skill.image.url}
        alt={skill.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.target.src = "https://placehold.co/100x100";
          e.target.className = "w-full h-full object-contain p-2";
        }}
      />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-textMain">{skill.name}</h4>
        <span className="text-sm font-bold text-primary">
          {skill.percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.percentage}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </div>
  </motion.div>
);

export default Skills;
