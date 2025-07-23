import axios from "axios";
import bcrypt from "bcryptjs";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";

export default function EmailVerificationUser() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // success | error | info
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const verifydata = useSelector((store) => store.verifyuser);

  // Show initial message from route
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
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await bcrypt.compare(code, verifydata.code);
      if (isValid) {
        setMessage("✅ You’ve successfully joined Aarambh38! Redirecting to login...");
        setMessageType("success");
        setShowMessage(true);

        const {
          fullName,
          gender,
          emailId,
          registration,
          newPassword,
          confirmPassword,
          collegeName,
          age,
          branch
        } = verifydata;
        const passkey="B8mYx72dKJrQWpLcEVANztf1hoG53uOXRMkC9Sig"
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
    passkey
  },
  { withCredentials: true }
);


        setTimeout(() => navigate("/loginselectorpage"), 2000);
      } else {
        setMessage("❌ Invalid verification code.");
        setMessageType("error");
        setShowMessage(true);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setMessage("⚠️ Something went wrong during verification.");
      setMessageType("error");
      setShowMessage(true);
    }

    setLoading(false);
  };

  // const handleResend = async () => {
  //   const newOtp = Math.floor(Math.random() * 900000) + 100000;
  //   const { emailId } = verifydata;

  //   try {
  //     await axios.post(
  //       "http://localhost:5000/sendemail",
  //       { emailId, code: newOtp },
  //       { withCredentials: true }
  //     );

  //     const hashed = await bcrypt.hash(newOtp.toString(), 10);
  //     verifydata.code = hashed;

  //     setMessage(`📩 New OTP sent to ${emailId}`);
  //     setMessageType("info");
  //     setShowMessage(true);
  //   } catch (err) {
  //     console.error("Resend error:", err);
  //     setMessage("❌ Failed to resend OTP. Try again later.");
  //     setMessageType("error");
  //     setShowMessage(true);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center px-4 relative">
      {/* Floating Toast */}
      {showMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`
              px-6 py-3 rounded-xl shadow-lg text-sm font-medium text-center animate-fade-in-out
              ${messageType === "success" ? "bg-green-100 text-green-800 border border-green-300"
                : messageType === "error" ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-blue-100 text-blue-800 border border-blue-300"}
            `}
          >
            {message}
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        {/* Branding */}
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
          Email Verification
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to your email to verify your identity.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full px-4 py-3 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Verifying..." : "Verify & Join"}
          </button>
        </form>

        {/* <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="text-blue-600 text-sm hover:underline"
          >
            Didn’t receive a code? Resend
          </button>
        </div> */}

        {/* Aarambh38 Promo */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 text-center shadow-sm">
          🌟 <strong className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">Aarambh38</strong> – where students and alumni connect, inspire, and grow together.
          <br />
          Be the spark in someone’s journey! 🔗
        </div>
      </div>
    </div>
  );
}
