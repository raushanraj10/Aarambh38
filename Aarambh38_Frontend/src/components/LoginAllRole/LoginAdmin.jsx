import { useState, useEffect } from "react";
import { Eye, EyeOff, Verified } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addadmin, removeadmin } from "../../utils/AdminSlice";
import { removealumini } from "../../utils/AluminiSlice";
import { removestudent } from "../../utils/StudentSlice";
import { Verifieduser } from "../../utils/EmailSlice";
import { BASE_URL } from "../../constants/AllUrl";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  useEffect(()=>{
        dispatch(removeadmin())
        dispatch(removealumini())
        dispatch(removestudent())
  },[])
  // const Admindata=useSelector((store)=>store.admindata)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // success | error | info
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowMessage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const emailId = email;
    const newPassword = password;

    try {
      const res = await axios.post(
  `${BASE_URL}/loginadmin`,
  { emailId, newPassword },
  { withCredentials: true }
);


      setMessage("🎉 Welcome Admin! Redirecting...");
      setMessageType("success");
      setShowMessage(true);
     dispatch(Verifieduser())
    dispatch(removealumini())
      dispatch(removestudent());
      dispatch(addadmin(res.data))

      setTimeout(() => {
        return navigate("/landingpage");
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "❌ Invalid email or password.";
      setMessage(msg);
      setMessageType("error");
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 py-12 relative">
      {/* Toast Message */}
      {showMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg text-sm font-medium text-center transition duration-300
            ${messageType === "success" ? "bg-green-100 text-green-800 border border-green-300"
              : messageType === "error" ? "bg-red-100 text-red-800 border border-red-300"
              : "bg-blue-100 text-blue-800 border border-blue-300"}`}
          >
            {message}
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        {/* Brand Title */}
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-1">
          Welcome Back!
        </h1>
        <p className="text-md text-center text-gray-600 mb-6">
          Login to{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            Aarambh38
          </span>{" "}
          Admin Panel
        </p>

        {/* Role Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium">
            🔐 Admin Login
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="••••••••"
            />
            <div
              className="absolute right-3 top-[42px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
          >
            Log In
          </button>
        </form>

        {/* Sign-up Link */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/signupchoice" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
