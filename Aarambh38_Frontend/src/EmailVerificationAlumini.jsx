import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";

export default function EmailVerificationAlumini() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const verifydata = useSelector((store) => store.verifyuser);

  // Show toast from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType("info");
      setShowMessage(true);
    }
  }, [location.state]);

  // Auto-hide toast
  useEffect(() => {
    if (showMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  // Resend OTP countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Submit verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const {
        fullName,
        branch,
        gender,
        emailId,
        registration,
        newPassword,
        confirmPassword,
        collegeName,
        role,
        company,
        batch,
        photourl,
        about,
        gate,
        linkedinshow,
      } = verifydata;

      const res = await axios.post(
        `${BASE_URL}/signupalumini`,
        {
          photourl,
          about,
          branch,
          fullName,
          gender,
          emailId,
          registration,
          newPassword,
          confirmPassword,
          batch,
          collegeName,
          company,
          role,
          code,
          gate,
          linkedinshow,
        },
        { withCredentials: true }
      );

      setMessage(`✅ ${res.data.message || "Signup successful!"}`);
      setMessageType("success");
      setShowMessage(true);

      setTimeout(() => navigate("/loginselectorpage"), 3000);
    } catch (err) {
      console.error("Verification error:", err);
      let backendMsg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setMessage(`🔴 ${backendMsg}`);
      setMessageType("error");
      setShowMessage(true);
    }

    setLoading(false);
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || resendLoading) return;
    setResendLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/sendemail`, // backend should handle alumni OTP resend
        { emailId: verifydata.emailId },
        { withCredentials: true }
      );

      setMessage("📩 A new OTP has been sent to your email.");
      setMessageType("success");
      setShowMessage(true);
      setResendTimer(60);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Failed to resend OTP. Try again."
      );
      setMessageType("error");
      setShowMessage(true);
    }

    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center px-4 py-8 relative">
      {/* Toast */}
      {showMessage && (
        <div
          className="fixed top-[80px] left-1/2 z-[9999] px-4"
          style={{
            transform: "translateX(-50%)",
            animation: "slideFadeIn 0.5s ease-out",
            width: "max-content",
            maxWidth: "90vw",
          }}
        >
          <div
            className={`px-6 py-3 rounded-xl shadow-lg text-sm font-medium
              ${
                messageType === "success"
                  ? "bg-green-100 border border-green-300 text-green-800"
                  : messageType === "error"
                  ? "bg-red-100 border border-red-300 text-red-800"
                  : "bg-blue-100 border border-blue-300 text-blue-800"
              }`}
          >
            {message}
          </div>
        </div>
      )}

      {/* Card */}
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Alumni Verification
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the{" "}
          <span className="font-semibold text-purple-600">6-digit code</span>{" "}
          sent to your email to complete your registration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold tracking-wide shadow"
          >
            {loading ? "Verifying..." : "Verify & Join"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600">
              ⏳ You can resend OTP in{" "}
              <span className="font-semibold text-purple-600">
                {resendTimer}s
              </span>
            </p>
          ) : (
           <button
  onClick={handleResendOtp}
  disabled={resendLoading}
  className={`inline-flex items-center gap-2 text-sm font-medium ${
    resendLoading
      ? "text-gray-400 cursor-not-allowed"
      : "text-purple-600 hover:text-purple-700 hover:underline"
  } transition-colors duration-200 focus:outline-none`}
>
  {resendLoading ? (
    <>
      {/* Spinner */}
      <span className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
      <span>Sending...</span>
    </>
  ) : (
    "Resend OTP"
  )}
</button>

          )}
        </div>

        {/* संyukt38 Promo */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 text-center shadow-inner">
          🌟{" "}
          <strong className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            संyukt38
          </strong>{" "}
          connects alumni and students to build a culture of inspiration, growth,
          and giving back.
          <br />
          <span className="text-purple-600 font-semibold">
            You’re not just verifying — you're empowering futures. 💼🎓
          </span>
        </div>
      </div>

      {/* CSS */}
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
        `}
      </style>
    </div>
  );
}
