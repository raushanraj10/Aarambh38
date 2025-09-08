import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Verifieduser } from "../../utils/EmailSlice";
import { addstudent, removestudent } from "../../utils/StudentSlice";
import { BASE_URL } from "../../constants/AllUrl";
import { removeadmin } from "../../utils/AdminSlice";
import { removealumini } from "../../utils/AluminiSlice";

export default function LoginUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(removeadmin());
    dispatch(removealumini());
    dispatch(removestudent());
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ emailId: "", newPassword: "" });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "success" | "error" | "info"
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowMessage(false); // Clear message on input change
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { emailId, newPassword } = formData;

  try {
    const res = await axios.post(
      `${BASE_URL}/loginuser`,
      { emailId, newPassword },
      { withCredentials: true }
    );

    if (res.data.success) {
      setMessage(res.data.message || "Welcome back! Student");
      setMessageType("success");
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);

        dispatch(Verifieduser());
        dispatch(addstudent(res.data.user)); // ✅ only pass user
        navigate("/landingpage");
      }, 1000);
    } else {
      setMessage(res.data.message || "Login failed. Please try again.");
      setMessageType("error");
      setShowMessage(true);
    }
  } catch (err) {
    const message =
      err.response?.data?.message || "Invalid email or password.";
    setMessage(message);
    setMessageType("error");
    setShowMessage(true);
  }
};

  // Auto-hide message after 4 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  // Scroll to top when message appears
  useEffect(() => {
    if (showMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center px-4 py-12 relative">
      {/* Floating Message */}
      {showMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`
              px-6 py-3 rounded-xl shadow-lg text-sm font-medium text-center transition duration-300
              ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : messageType === "error"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }
            `}
          >
            {message}
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-1">
          Welcome Back!
        </h1>
        <p className="text-md text-center text-gray-600 mb-6">
          Login to{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            संyukt38
          </span>{" "}
          as Student
        </p>

        <div className="flex justify-center mb-6">
          <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
            🎓 Student Login
          </span>
        </div>

       <form onSubmit={handleSubmit} className="space-y-5">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Email
    </label>
    <input
      type="email"
      name="emailId"
      value={formData.emailId}
      onChange={handleChange}
      placeholder="student@example.com"
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      required
    />
  </div>

  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Password
    </label>
    <input
      type={showPassword ? "text" : "password"}
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
      placeholder="••••••••"
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      required
    />
    <div
      className="absolute right-3 top-[42px] text-gray-500 cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </div>
  </div>

  <button
    type="submit"
    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
  >
    Log In
  </button>

  {/* Forgot Password Button */}
  <button
    type="button"
    onClick={() => navigate("/forgotpasswordotp")}
    className="w-full mt-2 text-green-600 font-medium hover:underline"
  >
    Forgot Password?
  </button>
</form>

<p className="text-sm text-center text-gray-500 mt-6">
  Don’t have an account?{" "}
  <a
    href="/signupchoice"
    className="text-green-600 font-medium hover:underline"
  >
    Sign up
  </a>
</p>


       
      </div>
    </div>
  );
}
