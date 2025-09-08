import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../src/constants/AllUrl";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // success vs error
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // from OTP page

  // Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
  const isStrongPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setIsSuccess(false);
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setMessage(
        "⚠️ Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      setIsSuccess(false);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/resetpassword`,
        { email, newPassword },
        { withCredentials: true }
      );
      setMessage("✅ Password reset successful! Redirecting...");
      setIsSuccess(true);
      setTimeout(() => navigate("/loginselectorpage"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to reset password.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold 
             text-transparent bg-clip-text 
             bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 
             bg-[length:200%_200%] bg-center 
             animate-[shimmer_3s_linear_infinite]
             tracking-tight text-center mb-6 pb-2"
        >
          संyukt38
        </h1>
        <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Reset Password
        </h1>

        {message && (
          <p
            className={`text-center mb-6 text-sm font-semibold ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
