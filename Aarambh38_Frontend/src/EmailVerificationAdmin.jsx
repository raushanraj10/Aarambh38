import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";

export default function EmailVerificationAdmin() {
  const [emailCode, setEmailCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const location = useLocation();
  const initialMessage = location.state?.message || "";
  const [message, setMessage] = useState(initialMessage);
  const [showMessage, setShowMessage] = useState(!!initialMessage);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const verifydata = useSelector((store) => store.verifyuser);

  // Redirect if user data is missing (e.g., refresh before signup completes)
  useEffect(() => {
    if (!verifydata?.emailId) {
      navigate("/signupadmin");
    }
  }, []);

  // Auto hide message after 4s
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!verifydata?.emailId) {
      setMessage("❌ Session expired. Please sign up again.");
      setShowMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      window.scrollTo({ top: 0, behavior: "smooth" });
      setMessage("🎉 Admin verified successfully!");
      setShowMessage(true);

      setTimeout(() => {
        navigate("/loginselectorpage");
      }, 2500);
    } catch (error) {
      console.error("Verification error:", error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMessage("⚠️ Verification failed. Check the codes and try again.");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-200 flex items-center justify-center px-4 relative">
      {/* Floating popup message */}
      {showMessage && (
        <div className="absolute top-6 bg-white border-l-4 border-blue-500 text-blue-800 px-6 py-3 rounded shadow-lg animate-fade-in-out font-medium">
          {message}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        {/* Heading & intro */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Admin Verification
          </h2>
          <p className="text-gray-700 text-sm">
            You're almost part of the{" "}
            <span className="text-blue-600 font-semibold">Aarambh38</span>{" "}
            leadership. Enter the codes sent to your email and admin passkey to
            continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-green-600 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
