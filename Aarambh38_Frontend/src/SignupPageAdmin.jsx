import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import bcrypt from "bcryptjs";
import { useDispatch } from "react-redux";
import { pendinguser } from "./utils/EmailSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Shimmer from "./Shimmer";
import { BASE_URL } from "./constants/AllUrl";
import { removestudent } from "./utils/StudentSlice";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";
import { useEffect } from "react";


export default function SignupPageAdmin() {
  const Dispatch=useDispatch()
      useEffect(()=>{
        Dispatch(removestudent())
        Dispatch(removeadmin())
        Dispatch(removealumini())
      },[])


  const code = Math.floor(Math.random() * 900000) + 100000;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "abc",
    emailId: "raushan@gmail.com",
    age: "25",
    gender: "Male",
    newPassword: "1234",
    confirmPassword: "1234",
    code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(""); // Clear error when user types
  };

  const validateFields = () => {
    const { fullName, emailId, age, gender, newPassword, confirmPassword } = formData;

    if (!fullName || !emailId || !age || !gender || !newPassword || !confirmPassword) {
      setFormError("⚠️ All fields are required.");
      return false;
    }

    if (newPassword.length < 3) {
      setFormError("🔐 Password must be at least 3 characters.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setFormError("🔒 Password and Confirm Password do not match.");
      return false;
    }

    return true;
  };

  const handleVerification = async () => {
    console.log(code)
    if (!validateFields()) return;

    setLoading(true);
    try {
      await axios.post(
  `${BASE_URL}/sendemail`,
  { email: formData.emailId, code },
  { withCredentials: true }
);

       console.log(code)
      const hashedCode = await bcrypt.hash(code.toString(), 10);
      const updatedData = { ...formData, code: hashedCode };
      dispatch(pendinguser(updatedData));

      setTimeout(() => {
        setLoading(false);
        navigate("/emailverificationadmin", {
          state: { message: `📩 OTP sent to kumar.........com` },
        });
      }, 1000);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setFormError("❌ Failed to send verification email.");
      setLoading(false);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">Welcome, Admin!</h2>
        <p className="text-center text-sm text-gray-600 mb-1">
          Join the leadership at{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Aarambh38
          </span>
        </p>
        <p className="text-xs text-center text-gray-400 mb-6">
          Please fill in your details to create your admin account.
        </p>

        {formError && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 rounded text-sm">
            {formError}
          </div>
        )}

        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleVerification}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up & Verify Email
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/loginselectorpage" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
