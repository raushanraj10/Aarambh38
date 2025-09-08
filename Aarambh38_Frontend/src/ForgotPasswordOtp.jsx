import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../src/constants/AllUrl";

export default function ForgotPasswordOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // request | verify
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // prevent double clicks
  const [timer, setTimer] = useState(0); // countdown in seconds
  const navigate = useNavigate();

  // Countdown effect for OTP
  useEffect(() => {
    let countdown;
    if (step === "verify" && timer > 0) {
      countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [step, timer]);

  // Format timer mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const emailId = email;
      const network="student"
      await axios.post(`${BASE_URL}/sendemailtoforget`, { emailId,network }, { withCredentials: true });
      setMessage("✅ OTP has been sent to your email.");
      setStep("verify");
      setTimer(600); // 10 minutes in seconds
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const emailId = email;
      const code = otp;
      const network = "student";
      await axios.post(`${BASE_URL}/verifytonewpassword`, { emailId, code, network }, { withCredentials: true });
      navigate("/resetpassword", { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        {/* Branding with centered gradient */}
   <h1
  className="text-3xl sm:text-4xl md:text-5xl font-bold 
             text-transparent bg-clip-text 
             bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 
             bg-[length:200%_200%] bg-center 
             animate-[shimmer_3s_linear_infinite]
             tracking-tight text-center mb-6 pb-2">
  संyukt38
</h1>


        <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm text-red-600 font-medium">
            {message}
          </p>
        )}

        {step === "request" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
  <form onSubmit={handleVerifyOtp} className="space-y-4">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => {
        // Only allow numbers and max 6 digits
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) setOtp(value);
      }}
      required
      maxLength={6}
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-center tracking-widest text-lg"
    />

    {/* Show error if not 6 digits */}
    {otp.length > 0 && otp.length < 6 && (
      <p className="text-sm text-center text-red-600 font-semibold">
        ⚠️ OTP must be 6 digits
      </p>
    )}

    {/* Show OTP Timer */}
    {timer > 0 ? (
      <p className="text-sm text-center text-gray-600">
        ⏳ OTP valid for{" "}
        <span className="font-semibold text-green-600">
          {formatTime(timer)}
        </span>
      </p>
    ) : (
      <p className="text-sm text-center text-red-600 font-semibold">
        ❌ OTP expired. Please request a new one.
      </p>
    )}

    <button
      type="submit"
      disabled={otp.length !== 6 || timer <= 0}
      className={`w-full py-3 rounded-lg font-semibold text-white transition ${
        otp.length === 6 && timer > 0
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      Verify OTP
    </button>
  </form>
)}

      </div>
    </div>
  );
}
