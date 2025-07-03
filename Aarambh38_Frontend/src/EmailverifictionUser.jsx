import axios from "axios";
import bcrypt from "bcryptjs";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function EmailVerificationUser() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const verifydata = useSelector((store) => store.verifyuser);

  // Show initial message if passed via navigation
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setShowMessage(true);
    }
  }, [location.state]);

  // Auto-hide popup message
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isTrue = await bcrypt.compare(code, verifydata.code);
      if (isTrue) {
        setMessage("✅ Email verified successfully!");
        setShowMessage(true);

        const { fullName, gender, emailId, registration, newPassword, confirmPassword, collegeName, age } = verifydata;

        await axios.post(
          "http://localhost:5000/signupuser",
          { fullName, gender, emailId, registration, newPassword, confirmPassword, age, collegeName },
          { withCredentials: true }
        );

        navigate("/loginselectorpage");
      } else {
        setMessage("❌ Invalid verification code.");
        setShowMessage(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("⚠️ Something went wrong during verification.");
      setShowMessage(true);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    const newOtp = Math.floor(Math.random() * 900000) + 100000;
    const { emailId } = verifydata;

    try {
      await axios.post("http://localhost:5000/sendemail", { emailId, code: newOtp }, { withCredentials: true });
      const hashedCode = await bcrypt.hash(newOtp.toString(), 10);

      // Directly mutate store.verifyuser (if safe), or ideally re-dispatch to update Redux
      verifydata.code = hashedCode;

      setMessage(`📩 OTP resent to ${emailId}`);
      setShowMessage(true);
    } catch (err) {
      console.error("OTP resend failed", err);
      setMessage("❌ Failed to resend OTP.");
      setShowMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
      {/* Floating popup */}
      {showMessage && (
        <div className="absolute top-6 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-lg shadow-md animate-fade-in-out">
          {message}
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email to complete verification.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter code"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="text-blue-600 text-sm hover:underline"
          >
            Didn’t receive a code? Resend
          </button>
        </div>
      </div>
    </div>
  );
}
