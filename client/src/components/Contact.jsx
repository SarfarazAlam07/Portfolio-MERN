import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSend, 
  FiUser, 
  FiMail, 
  FiMessageSquare, 
  FiMapPin, 
  FiClock, 
  FiChevronDown, 
  FiChevronUp,
  FiPhone 
} from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // ✅ New phone field
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/contact/send`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as +91 99999 99999
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 5) return `${phoneNumber.slice(0,3)} ${phoneNumber.slice(3)}`;
    if (phoneNumber.length <= 10) return `${phoneNumber.slice(0,3)} ${phoneNumber.slice(3,8)} ${phoneNumber.slice(8)}`;
    return `${phoneNumber.slice(0,3)} ${phoneNumber.slice(3,8)} ${phoneNumber.slice(8,13)}`;
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-bg text-textMain transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 sm:w-80 sm:h-80"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10 sm:w-80 sm:h-80"></div>

      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Connect</span>
          </h2>
          <p className="text-textMuted text-sm sm:text-base max-w-xl mx-auto">
            Have a project or question? I'll respond within 24 hours.
          </p>
        </motion.div>

        {/* Mobile: Toggle Contact Info */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/15 transition-colors"
          >
            <span className="font-medium flex items-center gap-2">
              <FiPhone className="text-primary" />
              Contact Information
            </span>
            {showContactInfo ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contact Info Cards */}
          <AnimatePresence>
            {(showContactInfo || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:col-span-1 space-y-4 mb-6 lg:mb-0 overflow-hidden"
              >
                {/* Contact Info Card */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-5 sm:p-6 rounded-xl border border-white/10 shadow-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FiPhone className="text-primary text-sm" />
                    </div>
                    Contact Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <FiPhone className="text-primary text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium text-textMain text-sm">Phone</h4>
                        <p className="text-textMuted text-sm">+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary/10 to-secondary/5 flex items-center justify-center flex-shrink-0 border border-secondary/20">
                        <FiMail className="text-secondary text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium text-textMain text-sm">Email</h4>
                        <p className="text-textMuted text-sm">contact@sarfaraz.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                        <FiMapPin className="text-purple-400 text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium text-textMain text-sm">Location</h4>
                        <p className="text-textMuted text-sm">Delhi, India</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">24h</div>
                        <div className="text-xs text-textMuted">Response</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-secondary">100%</div>
                        <div className="text-xs text-textMuted">Reply Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-400">100+</div>
                        <div className="text-xs text-textMuted">Projects</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Note */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-md p-4 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-primary text-xs" />
                    </div>
                    <div>
                      <h4 className="font-medium text-textMain text-sm">Available</h4>
                      <p className="text-xs text-textMuted">Open for projects & calls</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
              {/* Form Header */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Send a message</h3>
                <p className="text-textMuted text-sm">Fill the form below to get in touch.</p>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-6">
                {/* Name & Email Row */}
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  {/* Name Input */}
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-textMuted mb-2">
                      <span className="flex items-center gap-1.5">
                        <FiUser className="text-primary text-sm" />
                        Your Name <span className="text-red-400">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-textMain placeholder:text-textMuted/50 text-sm sm:text-base"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-medium text-textMuted mb-2">
                      <span className="flex items-center gap-1.5">
                        <FiMail className="text-secondary text-sm" />
                        Email Address <span className="text-red-400">*</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all text-textMain placeholder:text-textMuted/50 text-sm sm:text-base"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-textMuted mb-2">
                    <span className="flex items-center gap-1.5">
                      <FiPhone className="text-green-400 text-sm" />
                      Phone Number <span className="text-textMuted text-xs">(Optional)</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setFormData({...formData, phone: formatted});
                    }}
                    className="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20 transition-all text-textMain placeholder:text-textMuted/50 text-sm sm:text-base"
                    placeholder="+91 98765 43210"
                    maxLength="17"
                  />
                  <p className="text-xs text-textMuted/70 mt-1.5">
                    📞 Optional - For quicker callback
                  </p>
                </div>

                {/* Message Input */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-textMuted mb-2">
                    <span className="flex items-center gap-1.5">
                      <FiMessageSquare className="text-purple-400 text-sm" />
                      Your Message <span className="text-red-400">*</span>
                    </span>
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all text-textMain placeholder:text-textMuted/50 text-sm sm:text-base resize-none"
                    placeholder="Tell me about your project, timeline, and budget..."
                    required
                  ></textarea>
                  <div className="text-xs text-textMuted/70 mt-1.5 flex justify-between">
                    <span>Include project details for faster response</span>
                    <span>{formData.message.length}/500</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <FiSend />
                        Send Message
                      </>
                    )}
                  </button>
                  <p className="text-center text-textMuted text-xs mt-3">
                    🔒 Your information is secure and will never be shared
                  </p>
                </div>
              </form>
            </div>

            {/* Mobile Quick Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm rounded-xl border border-white/10 lg:hidden">
              <p className="text-sm text-textMuted text-center">
                💡 <span className="font-medium text-textMain">Pro tip:</span> Add phone for quicker callback
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;