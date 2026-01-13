import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiLayers,
  FiCode,
  FiTrash2,
  FiPlus,
  FiImage,
  FiGithub,
  FiLayout,
  FiFileText,
  FiUploadCloud,
  FiHome,
  FiUser,
  FiType,
  FiSun,
  FiMoon,
  FiLink,
  FiEdit2,
  FiX,
  FiLock,
  FiSave,
} from "react-icons/fi";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [editingItem, setEditingItem] = useState({ type: null, id: null });

  // ✅ AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- STATES ---
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // Resume State
  const [resumeUrl, setResumeUrl] = useState("");
  const [currentResume, setCurrentResume] = useState("");

  // Form States
  const [skillName, setSkillName] = useState("");
  const [skillPercent, setSkillPercent] = useState("");
  const [skillImage, setSkillImage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [gitHubLink, setGitHubLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [image, setImage] = useState("");

  // Profile States
  const [name, setName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [aboutDesc, setAboutDesc] = useState("");
  const [roles, setRoles] = useState("");
  const [avatar, setAvatar] = useState("");

  // Edit States
  const [editSkillData, setEditSkillData] = useState({
    name: "",
    percentage: "",
    image: "",
  });
  const [editProjectData, setEditProjectData] = useState({
    title: "",
    description: "",
    techStack: "",
    gitHubLink: "",
    projectLink: "",
    image: "",
  });

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // ✅ AUTHENTICATION CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setCheckingAuth(true);
        const { data } = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
          withCredentials: true,
        });

        if (data.success && data.user) {
          setIsAuthenticated(true);
        } else {
          toast.error("Please login first");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, BACKEND_URL]);

  // --- THEME LOGIC ---
  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.setAttribute("data-theme", "dark");
    } else {
      body.removeAttribute("data-theme");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // --- FETCH DATA ---
  const fetchAllData = async () => {
    try {
      const { data: skillData } = await axios.get(
        `${BACKEND_URL}/api/v1/skill/all`
      );
      setSkills(skillData.skills);

      const { data: projectData } = await axios.get(
        `${BACKEND_URL}/api/v1/project/all`
      );
      setProjects(projectData.projects);

      const { data: userData } = await axios.get(
        `${BACKEND_URL}/api/v1/user/me`
      );

      if (userData.user) {
        if (userData.user.resume && userData.user.resume.url) {
          setCurrentResume(userData.user.resume.url);
          setResumeUrl(userData.user.resume.url);
        }

        if (userData.user.about) {
          setName(userData.user.about.name || "");
          setProfileTitle(userData.user.about.title || "");
          setSubtitle(userData.user.about.subtitle || "");
          setAboutDesc(userData.user.about.description || "");
          if (userData.user.about.roles)
            setRoles(userData.user.about.roles.join(", "));
          if (userData.user.about.avatar)
            setAvatar(userData.user.about.avatar.url);
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // --- EDIT HANDLERS ---
  const startEditSkill = (skill) => {
    setEditingItem({ type: "skill", id: skill._id });
    setEditSkillData({
      name: skill.name,
      percentage: skill.percentage,
      image: skill.image?.url || "",
    });
  };

  const startEditProject = (project) => {
    setEditingItem({ type: "project", id: project._id });
    setEditProjectData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      gitHubLink: project.gitHubLink || "",
      projectLink: project.projectLink || "",
      image: project.image?.url || "",
    });
  };

  const cancelEdit = () => {
    setEditingItem({ type: null, id: null });
    setEditSkillData({ name: "", percentage: "", image: "" });
    setEditProjectData({
      title: "",
      description: "",
      techStack: "",
      gitHubLink: "",
      projectLink: "",
      image: "",
    });
  };

  // Update Skill
  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!editSkillData.name || !editSkillData.percentage) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/v1/skill/${editingItem.id}`,
        {
          name: editSkillData.name,
          percentage: editSkillData.percentage,
          image: editSkillData.image,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      cancelEdit();
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // Update Project
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (
      !editProjectData.title ||
      !editProjectData.description ||
      !editProjectData.techStack
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/v1/project/${editingItem.id}`,
        editProjectData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      cancelEdit();
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // --- ORIGINAL HANDLERS ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/v1/user/update/profile`,
        {
          name,
          title: profileTitle,
          subtitle,
          description: aboutDesc,
          roles,
          avatar,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/project/add`,
        { title, description, techStack, gitHubLink, projectLink, image },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setTitle("");
      setDescription("");
      setTechStack("");
      setGitHubLink("");
      setProjectLink("");
      setImage("");
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Adding Project");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/skill/add`,
        { name: skillName, percentage: skillPercent, image: skillImage },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setSkillName("");
      setSkillPercent("");
      setSkillImage("");
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Adding Skill");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResume = async (e) => {
    e.preventDefault();
    if (!resumeUrl) return toast.error("Enter Resume URL first");
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/v1/user/resume/update`,
        { resume: resumeUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      await fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Resume Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete Project?")) return;
    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/v1/project/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchAllData();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      const { data } = await axios.delete(`${BACKEND_URL}/api/v1/skill/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      fetchAllData();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ LOADING STATE FOR AUTH CHECK
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textMain">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ REDIRECT IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <FiLock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-textMain mb-2">
            Access Denied
          </h2>
          <p className="text-textMuted mb-6">
            You need to login to access the dashboard
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // --- COMPONENTS ---
  const SidebarButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 w-full whitespace-nowrap font-bold text-sm border border-transparent ${
        activeTab === id
          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 translate-x-2"
          : "text-textMuted hover:bg-card hover:border-borderColor hover:text-textMain hover:translate-x-1"
      }`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  const MobileNavButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative flex flex-col items-center justify-center p-2 transition-all duration-300 ${
        activeTab === id
          ? "text-primary -translate-y-2"
          : "text-textMuted hover:text-textMain"
      }`}
    >
      <div
        className={`p-3 rounded-full transition-all ${
          activeTab === id
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-transparent"
        }`}
      >
        <Icon size={20} />
      </div>
      <span
        className={`text-[10px] font-bold mt-1 transition-all ${
          activeTab === id
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 hidden"
        }`}
      >
        {label}
      </span>
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300 relative"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-main)" }}
    >
      {/* HEADER */}
      <header
        className="backdrop-blur-md border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl text-white shadow-lg">
            <FiLayout size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs opacity-70 font-bold tracking-wide">
              ADMIN CONTROL PANEL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border hover:text-primary transition-all hover:scale-110"
            style={{ borderColor: "var(--border-color)" }}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-2 px-4 py-2 border hover:text-primary transition-all rounded-lg text-sm font-bold"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <FiHome /> View Website
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-sm font-bold"
          >
            <FiLogOut /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 mb-20 md:mb-0">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block md:sticky md:top-28 h-fit z-30">
          <div className="flex flex-col gap-2">
            <SidebarButton id="projects" label="Projects" icon={FiLayers} />
            <SidebarButton id="skills" label="Skills" icon={FiCode} />
            <SidebarButton id="resume" label="Resume" icon={FiFileText} />
            <SidebarButton id="profile" label="Profile" icon={FiUser} />
          </div>
        </aside>

        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <div
            className="backdrop-blur-xl border rounded-2xl shadow-2xl flex justify-around items-center px-2 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <MobileNavButton id="projects" label="Projects" icon={FiLayers} />
            <MobileNavButton id="skills" label="Skills" icon={FiCode} />
            <MobileNavButton id="resume" label="Resume" icon={FiFileText} />
            <MobileNavButton id="profile" label="Profile" icon={FiUser} />
          </div>
        </div>

        {/* CONTENT AREA */}
        <main className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* --- PROJECTS TAB --- */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Add Project Form */}
                <div className="card-style mb-8">
                  <div
                    className="mb-6 pb-4 border-b border-borderColor flex justify-between items-center"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <h3 className="text-xl font-bold">Add New Project</h3>
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <FiPlus size={24} />
                    </div>
                  </div>

                  <form
                    onSubmit={handleAddProject}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label-style">Project Title</label>
                        <input
                          type="text"
                          placeholder="e.g. E-Commerce App"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="input-style"
                          required
                        />
                      </div>
                      <div>
                        <label className="label-style">Tech Stack</label>
                        <input
                          type="text"
                          placeholder="React, Node, MongoDB"
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          className="input-style"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-style">Description</label>
                      <textarea
                        placeholder="Describe features..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-style h-32"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label-style">GitHub Link</label>
                        <input
                          type="text"
                          placeholder="https://github.com/..."
                          value={gitHubLink}
                          onChange={(e) => setGitHubLink(e.target.value)}
                          className="input-style"
                        />
                      </div>
                      <div>
                        <label className="label-style">Live Demo Link</label>
                        <input
                          type="text"
                          placeholder="https://myapp.com"
                          value={projectLink}
                          onChange={(e) => setProjectLink(e.target.value)}
                          className="input-style"
                        />
                      </div>
                    </div>

                    {/* 👇 URL INPUT FOR PROJECT IMAGE */}
                    <div>
                      <label className="label-style">Project Image URL</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Paste image link here (e.g. https://imgur.com/...)"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          className="input-style flex-1"
                          required
                        />
                        {/* PREVIEW */}
                        <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 flex-shrink-0">
                          {image ? (
                            <img
                              src={image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                              Preview
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-primary w-full md:w-auto self-end px-10"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Project"}
                    </button>
                  </form>
                </div>

                {/* Edit Project Form (when editing) */}
                {editingItem.type === "project" && (
                  <div className="card-style mb-8 border-2 border-primary/30 bg-primary/5">
                    <div className="mb-6 pb-4 border-b border-primary/30 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <FiEdit2 /> Edit Project
                      </h3>
                      <button
                        onClick={cancelEdit}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    <form
                      onSubmit={handleUpdateProject}
                      className="flex flex-col gap-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="label-style">Project Title</label>
                          <input
                            type="text"
                            value={editProjectData.title}
                            onChange={(e) =>
                              setEditProjectData({
                                ...editProjectData,
                                title: e.target.value,
                              })
                            }
                            className="input-style"
                            required
                          />
                        </div>
                        <div>
                          <label className="label-style">Tech Stack</label>
                          <input
                            type="text"
                            value={editProjectData.techStack}
                            onChange={(e) =>
                              setEditProjectData({
                                ...editProjectData,
                                techStack: e.target.value,
                              })
                            }
                            className="input-style"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-style">Description</label>
                        <textarea
                          value={editProjectData.description}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              description: e.target.value,
                            })
                          }
                          className="input-style h-32"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="label-style">GitHub Link</label>
                          <input
                            type="text"
                            value={editProjectData.gitHubLink}
                            onChange={(e) =>
                              setEditProjectData({
                                ...editProjectData,
                                gitHubLink: e.target.value,
                              })
                            }
                            className="input-style"
                          />
                        </div>
                        <div>
                          <label className="label-style">Live Demo Link</label>
                          <input
                            type="text"
                            value={editProjectData.projectLink}
                            onChange={(e) =>
                              setEditProjectData({
                                ...editProjectData,
                                projectLink: e.target.value,
                              })
                            }
                            className="input-style"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-style">Project Image URL</label>
                        <div className="flex gap-4 items-center">
                          <input
                            type="text"
                            value={editProjectData.image}
                            onChange={(e) =>
                              setEditProjectData({
                                ...editProjectData,
                                image: e.target.value,
                              })
                            }
                            className="input-style flex-1"
                            required
                          />
                          <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 flex-shrink-0">
                            {editProjectData.image ? (
                              <img
                                src={editProjectData.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                Preview
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-6 py-2 border rounded-lg hover:bg-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary px-8"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Existing Projects List */}
                <h3 className="text-lg font-bold text-textMuted mb-4">
                  Existing Projects ({projects.length})
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((p) => (
                    <div
                      key={p._id}
                      className="card-style p-5 flex justify-between items-center hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={p.image?.url}
                          alt={p.title}
                          className="w-16 h-16 rounded-lg object-cover border"
                          style={{ borderColor: "var(--border-color)" }}
                        />
                        <div className="flex-1">
                          <span className="font-bold text-lg block">
                            {p.title}
                          </span>
                          <span className="text-xs opacity-70 font-mono">
                            {p.techStack}
                          </span>
                          <p className="text-sm opacity-80 mt-1 line-clamp-1">
                            {p.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditProject(p)}
                          className="p-2.5 opacity-60 hover:opacity-100 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          className="p-2.5 opacity-60 hover:opacity-100 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p
                      className="text-center opacity-50 py-10 border border-dashed rounded-xl"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      No projects found.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- SKILLS TAB --- */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Add Skill Form */}
                <div className="card-style mb-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FiCode className="text-primary" /> Add New Skill
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="label-style">Skill Name</label>
                        <input
                          type="text"
                          placeholder="e.g. React.js"
                          value={skillName}
                          onChange={(e) => setSkillName(e.target.value)}
                          className="input-style"
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="label-style">Percent (%)</label>
                        <input
                          type="number"
                          placeholder="0-100"
                          value={skillPercent}
                          onChange={(e) => setSkillPercent(e.target.value)}
                          className="input-style"
                        />
                      </div>
                    </div>

                    {/* 👇 SKILL ICON URL INPUT */}
                    <div>
                      <label className="label-style">
                        Skill Icon/Logo URL (SVG/PNG)
                      </label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="https://cdn.worldvectorlogo.com/logos/react-2.svg"
                          value={skillImage}
                          onChange={(e) => setSkillImage(e.target.value)}
                          className="input-style flex-1"
                        />
                        <div className="w-12 h-12 p-1 rounded-lg border overflow-hidden bg-white flex-shrink-0">
                          {skillImage ? (
                            <img
                              src={skillImage}
                              alt="Icon"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[10px] text-gray-400">
                              Icon
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddSkill}
                      className="btn-primary w-full h-[50px] mt-2"
                      disabled={loading}
                    >
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* Edit Skill Form (when editing) */}
                {editingItem.type === "skill" && (
                  <div className="card-style mb-8 border-2 border-primary/30 bg-primary/5">
                    <div className="mb-6 pb-4 border-b border-primary/30 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <FiEdit2 /> Edit Skill
                      </h3>
                      <button
                        onClick={cancelEdit}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    <form
                      onSubmit={handleUpdateSkill}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <label className="label-style">Skill Name</label>
                          <input
                            type="text"
                            value={editSkillData.name}
                            onChange={(e) =>
                              setEditSkillData({
                                ...editSkillData,
                                name: e.target.value,
                              })
                            }
                            className="input-style"
                            required
                          />
                        </div>
                        <div className="w-full md:w-32">
                          <label className="label-style">Percent (%)</label>
                          <input
                            type="number"
                            value={editSkillData.percentage}
                            onChange={(e) =>
                              setEditSkillData({
                                ...editSkillData,
                                percentage: e.target.value,
                              })
                            }
                            className="input-style"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-style">Skill Icon URL</label>
                        <div className="flex gap-4 items-center">
                          <input
                            type="text"
                            value={editSkillData.image}
                            onChange={(e) =>
                              setEditSkillData({
                                ...editSkillData,
                                image: e.target.value,
                              })
                            }
                            className="input-style flex-1"
                            required
                          />
                          <div className="w-12 h-12 p-1 rounded-lg border overflow-hidden bg-white flex-shrink-0">
                            {editSkillData.image ? (
                              <img
                                src={editSkillData.image}
                                alt="Icon"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-[10px] text-gray-400">
                                Icon
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end mt-4">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-6 py-2 border rounded-lg hover:bg-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary px-8"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Existing Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.map((s) => (
                    <div
                      key={s._id}
                      className="card-style p-4 flex justify-between items-center hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-md bg-white p-1 border">
                          <img
                            src={s.image?.url}
                            alt={s.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-sm">{s.name}</span>
                            <span className="text-xs text-primary font-bold">
                              {s.percentage}%
                            </span>
                          </div>
                          <div
                            className="w-full h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: "var(--bg-color)" }}
                          >
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                              style={{ width: `${s.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditSkill(s)}
                          className="opacity-60 hover:opacity-100 hover:text-primary hover:bg-primary/10 transition-colors p-2 rounded-lg"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(s._id)}
                          className="opacity-60 hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-colors p-2 rounded-lg"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- RESUME TAB --- */}
            {activeTab === "resume" && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-style text-center py-12">
                  <div className="inline-flex p-5 rounded-full bg-primary/10 text-primary mb-6">
                    <FiFileText size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Manage Resume Link
                  </h3>
                  <p className="text-xs opacity-70 mb-8 max-w-md mx-auto">
                    Paste the link to your Google Drive / Dropbox PDF here.
                  </p>

                  <form
                    onSubmit={handleUpdateResume}
                    className="max-w-md mx-auto flex flex-col gap-4"
                  >
                    <div>
                      <label className="label-style text-left block">
                        Resume PDF URL
                      </label>
                      <div className="relative">
                        <FiLink className="absolute left-4 top-4 text-textMuted" />
                        <input
                          type="text"
                          placeholder="https://drive.google.com/file/d/..."
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          className="input-style pl-12"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full mt-2"
                    >
                      {loading ? "Updating..." : "Update Resume Link"}
                    </button>
                  </form>

                  {currentResume && (
                    <div className="mt-8">
                      <p className="text-sm text-green-500 font-bold mb-2">
                        ● Current Resume Active
                      </p>
                      <a
                        href={currentResume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm break-all"
                      >
                        {currentResume}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- PROFILE TAB --- */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-style">
                  <h3
                    className="text-2xl font-bold mb-8 pb-4 border-b"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    Edit Hero Section
                  </h3>
                  <form
                    onSubmit={handleUpdateProfile}
                    className="flex flex-col gap-8"
                  >
                    {/* Avatar URL Input */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="w-36 h-36 rounded-full overflow-hidden border-4 shadow-2xl relative"
                        style={{ borderColor: "var(--card-bg)" }}
                      >
                        <img
                          src={avatar || "https://placehold.co/500x500"}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-full max-w-md">
                        <label className="label-style text-center block">
                          Avatar Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://imgur.com/..."
                          value={avatar}
                          onChange={(e) => setAvatar(e.target.value)}
                          className="input-style text-center"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="label-style">Display Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-style"
                        />
                      </div>
                      <div>
                        <label className="label-style">Top Greeting</label>
                        <input
                          type="text"
                          value={profileTitle}
                          onChange={(e) => setProfileTitle(e.target.value)}
                          className="input-style"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-style">
                        Main Role (Subtitle)
                      </label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="input-style"
                      />
                    </div>

                    <div>
                      <label className="label-style flex items-center gap-2">
                        <FiType /> Typewriter Roles{" "}
                        <span className="text-xs font-normal opacity-70 normal-case">
                          (Comma separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={roles}
                        onChange={(e) => setRoles(e.target.value)}
                        className="input-style"
                      />
                    </div>

                    <div>
                      <label className="label-style">Short Bio</label>
                      <textarea
                        rows="4"
                        value={aboutDesc}
                        onChange={(e) => setAboutDesc(e.target.value)}
                        className="input-style resize-none h-32"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full md:w-auto self-end px-12"
                    >
                      {loading ? "Updating..." : "Save Profile Changes"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
