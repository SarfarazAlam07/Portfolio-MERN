import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Backend se pucho: "Kya main logged in hoon?"
        const { data } = await axios.get(
          `${BACKEND_URL}/api/v1/user/admin/check`,
          {
            withCredentials: true, // 👈 Ye Zaroori hai (Cookie bhejne ke liye)
          }
        );

        if (data.user) {
          setIsAuthenticated(true);
        } else {
          // User nahi mila
          navigate("/");
        }
      } catch (error) {
        // Agar error aaya (401 Unauthorized), toh bahar nikalo
        setIsAuthenticated(false);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, BACKEND_URL]);

  // Jab tak check kar rahe hain, Loading dikhao
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Agar logged in hai, tabhi Dashboard (children) dikhao
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
