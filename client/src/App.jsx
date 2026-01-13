import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundAnimation from "./components/BackgroundAnimation"; // ✅ Imported

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact"; 
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Home Component
const Home = () => {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <Skills />
        <Portfolio />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="bg-bg text-textMain min-h-screen font-sans transition-colors duration-300 w-full overflow-x-hidden relative">
        {" "}
        {/* ✅ ADDED 'relative' class */}
        {/* 👇 ADD BACKGROUND ANIMATION HERE 👇 */}
        <BackgroundAnimation />
        {/* 👇 CONTENT SHOULD BE ABOVE BACKGROUND 👇 */}
        <div className="relative z-10">
          {" "}
          {/* ✅ ADDED wrapper div with z-index */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </div>
    </Router>
  );
}

export default App;
