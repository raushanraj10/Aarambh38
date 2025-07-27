import axios from "axios";
import bcrypt from "bcryptjs";
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
  const [hashedCode, setHashedCode] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const verifydata = useSelector((store) => store.verifyuser);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType("info");
      setShowMessage(true);
    }
    if (verifydata.code) {
      setHashedCode(verifydata.code);
    }
  }, [location.state, verifydata]);

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
      const isValid = await bcrypt.compare(code, hashedCode);
      if (isValid) {
        setMessage("🎉 Welcome to the Aarambh38 family! Your journey starts here.");
        setMessageType("success");
        setShowMessage(true);

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
        } = verifydata;
        const passkey="U7fK93pLzQeRmXY4tWcVB28GdhJkAo1ZxN56rMuE"
        await axios.post(
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
    passkey,
  },
  { withCredentials: true }
);


        setTimeout(() => navigate("/loginselectorpage"), 3000);
      } else {
        setMessage("❌ Invalid verification code.");
        setMessageType("error");
        setShowMessage(true);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setMessage("⚠️ Something went wrong. Please try again.");
      setMessageType("error");
      setShowMessage(true);
    }

    setLoading(false);
  };

  // const handleResend = async () => {
  //   const otp = Math.floor(Math.random() * 900000) + 100000;
  //   const { emailId } = verifydata;

  //   try {
  //     await axios.post(
  //       "http://localhost:5000/sendemail",
  //       { emailId, code: otp },
  //       { withCredentials: true }
  //     );

  //     const newHash = await bcrypt.hash(otp.toString(), 10);
  //     setHashedCode(newHash);
  //     setMessage(`📩 A new OTP has been sent to ${emailId}`);
  //     setMessageType("success");
  //     setShowMessage(true);
  //   } catch (err) {
  //     console.error("Resend error:", err);
  //     setMessage("❌ Failed to resend OTP.");
  //     setMessageType("error");
  //     setShowMessage(true);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center px-4 relative">
      {/* Dynamic Toast */}
      {showMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-3 rounded-xl shadow-md text-sm font-medium animate-fade-in-out
              ${messageType === "success"
                ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
                : messageType === "error"
                ? "bg-red-100 border border-red-300 text-red-800"
                : "bg-purple-100 border border-purple-300 text-purple-800"
              }`}
          >
            {message}
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Alumni Verification
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to your email to complete your registration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full px-4 py-3 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Verifying..." : "Verify & Join"}
          </button>
        </form>

        {/* <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="text-purple-600 text-sm hover:underline"
          >
            Didn’t receive a code? Resend
          </button>
        </div> */}

        {/* Aarambh38 Promo Box */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 text-center shadow">
          🌟 <strong className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">Aarambh38</strong> connects alumni and students to build a culture of inspiration, growth, and giving back.
          <br />
          <span className="text-purple-600 font-semibold">You’re not just verifying—you're empowering futures. 💼🎓</span>
        </div>
      </div>
    </div>
  );
}
