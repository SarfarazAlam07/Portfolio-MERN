import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 👇 ENVIRONMENT VARIABLE LOGIC (Auto-detect Live URL)
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/user/login`, // 👈 URL Update
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);

      // Redirect logic
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-borderColor relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <FiLock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-textMain">Admin Portal</h2>
          <p className="text-textMuted text-sm">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1 block pl-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-textMuted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg border border-borderColor rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-textMain text-sm"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1 block pl-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-textMuted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg border border-borderColor rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-textMain text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Login Access <FiArrowRight />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
