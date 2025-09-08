import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";
import { RefreshCcw } from "lucide-react";
export default function EmailVerificationAdmin() {
  const [emailCode, setEmailCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resend OTP
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
 
  const verifydata = useSelector((store) => store.verifyuser);

  // Redirect if user data missing
  useEffect(() => {
    if (!verifydata?.emailId) {
      navigate("/signupadmin");
    }
  }, [verifydata, navigate]);

  // Auto hide toast
  useEffect(() => {
    if (showMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!verifydata?.emailId) {
      setMessage("❌ Session expired. Please sign up again.");
      setMessageType("error");
      setShowMessage(true);
      return;
    }

    setLoading(true);
    setShowMessage(false);

    try {
      const {
        fullName,
        gender,
        emailId,
        newPassword,
        confirmPassword,
        photourl,
        mobileNumber,
        collegeName,
      } = verifydata;

      await axios.post(
        `${BASE_URL}/signupadmin`,
        {
          fullName,
          gender,
          emailId,
          newPassword,
          confirmPassword,
          photourl,
          mobileNumber,
          collegeName,
          code: emailCode,
          admincode: adminCode,
        },
        { withCredentials: true }
      );

      setMessage("🎉 Admin verified successfully!");
      setMessageType("success");
      setShowMessage(true);

      setTimeout(() => navigate("/loginselectorpage"), 2500);
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("⚠️ Verification failed. Check the codes and try again.");
      setMessageType("error");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP handler
  // Add new state
const [resending, setResending] = useState(false);

// ✅ Resend OTP handler
const handleResendOtp = async () => {
  if (!verifydata?.emailId || resendTimer > 0 || resending) return;

  setResending(true); // lock immediately

  try {
    await axios.post(
      `${BASE_URL}/sendemail`,
      { emailId: verifydata.emailId },
      { withCredentials: true }
    );

    await axios.post(
      `${BASE_URL}/sendemailadmin`,
      {
        emailId: verifydata.emailId,
        collegeName: verifydata.collegeName,
        fullName: verifydata.fullName,
        gender: verifydata.gender,
        mobileNumber:verifydata.mobileNumber
      },
      { withCredentials: true }
    );

    setMessage("📩 OTP resent to your email!");
    setMessageType("info");
    setShowMessage(true);

    setResendTimer(60); // start cooldown
  } catch (error) {
    console.error("Resend error:", error);
    setMessage("⚠️ Failed to resend OTP. Try again later.");
    setMessageType("error");
    setShowMessage(true);
  } finally {
    setResending(false); // unlock after call finishes
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-200 flex items-center justify-center px-4 relative">
      {/* Toast */}
      {showMessage && (
        <div
          className={`fixed top-[80px] left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-[9999]
          ${
            messageType === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : messageType === "error"
              ? "bg-red-100 border border-red-400 text-red-800"
              : "bg-blue-100 border border-blue-400 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md animate-fade-in">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Admin Verification
          </h2>
          <p className="text-gray-700 text-sm">
            You're almost part of{" "}
            <span className="text-blue-600 font-semibold">संyukt38</span>.
            Enter the OTP from email and your admin code to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-center text-lg tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit OTP"
              required
            />
          </div>

          {/* Admin Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-center text-lg tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Admin code"
              required
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-green-600 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        {/* Resend OTP */}
 

<button
  onClick={handleResendOtp}
  disabled={resendTimer > 0 || resending}
  className={`w-full flex items-center justify-center gap-2 text-sm font-medium rounded-md px-4 py-2 transition ${
    resendTimer > 0 || resending
      ? "text-gray-400 cursor-not-allowed"
      : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
  }`}
>
  {resending ? (
    <>
      <RefreshCcw className="w-4 h-4 animate-spin" />
      <span>Sending...</span>
    </>
  ) : resendTimer > 0 ? (
    <span>⏳ Resend OTP in {resendTimer}s</span>
  ) : (
    <>
      <RefreshCcw className="w-4 h-4" />
      <span>Resend OTP</span>
    </>
  )}
</button>


      </div>
    </div>
  );
}
