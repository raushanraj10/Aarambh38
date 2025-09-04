import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";

export default function EmailVerificationUser() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const verifydata = useSelector((store) => store.verifyuser);

  // Show message from route
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType("info");
      setShowMessage(true);
    }
  }, [location.state]);

  // Auto-hide message
  useEffect(() => {
    if (showMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    const {
      fullName,
      gender,
      emailId,
      registration,
      newPassword,
      confirmPassword,
      collegeName,
      age,
      branch,
      photourl,
      batch,
    } = verifydata;

    await axios.post(
      `${BASE_URL}/signupuser`,
      {
        fullName,
        gender,
        emailId,
        registration,
        newPassword,
        confirmPassword,
        collegeName,
        age,
        branch,
        photourl,
        code,
        batch,
      },
      { withCredentials: true }
    );

    setMessage("✅ Verification successful! Welcome to संyukt38 🎉");
    setMessageType("success");
    setShowMessage(true);

    setTimeout(() => navigate("/loginselectorpage"), 2500);
  } catch (err) {
  console.error("Verification error:", err);

  let backendMsg =
    err.response?.data?.message || // ✅ proper backend message
    err.message ||                 // axios/network message
    "Something went wrong. Please try again.";

  // safety: if backend accidentally sends an object
  if (typeof backendMsg === "object") {
    backendMsg = JSON.stringify(backendMsg);
  }

  setMessage(`🔴 ${backendMsg}`);
  setMessageType("error");
  setShowMessage(true);}

  setLoading(false);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-purple-100 flex items-center justify-center px-4 py-8 relative">
      {/* Toast */}
      {showMessage && (
        <div
          className="fixed top-[70px] left-1/2 z-[9999] px-4"
          style={{
            transform: "translateX(-50%)",
            animation: "slideFadeIn 0.4s ease-out",
            width: "max-content",
            maxWidth: "90vw",
          }}
        >
          <div
            className={`px-6 py-3 rounded-xl shadow-xl text-sm font-semibold backdrop-blur-md
            ${
              messageType === "success"
                ? "bg-green-100/80 border border-green-400 text-green-800"
                : messageType === "error"
                ? "bg-red-100/80 border border-red-400 text-red-800"
                : "bg-blue-100/80 border border-blue-400 text-blue-800"
            }`}
          >
            {message}
          </div>
        </div>
      )}

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fade-in border border-gray-200">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight drop-shadow-sm">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600 mb-6">
  Enter the{" "}
  <span className="font-semibold text-blue-600">6-digit code</span>{" "}
  sent to your registered email to activate your account.
</p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••"
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-center text-2xl font-mono tracking-[0.6em] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white shadow-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-xl font-bold text-lg tracking-wide shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "🔄 Verifying..." : "✅ Verify & Join"}
          </button>
        </form>

        {/* संyukt38 Promo */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 text-center shadow-inner">
          🎓{" "}
          <strong className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            संyukt38
          </strong>{" "}
          is your space to grow, connect, and shine. <br />
          <span className="text-blue-600 font-semibold">
            Verify now and join a community of dreamers & achievers 🚀
          </span>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideFadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeInUp 0.6s ease-in-out;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
