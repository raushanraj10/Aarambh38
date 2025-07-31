import { useState, useEffect } from "react";
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

export default function SignupPageAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(removestudent());
    dispatch(removeadmin());
    dispatch(removealumini());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    age: "",
    gender: "",
    newPassword: "",
    confirmPassword: "",
    photourl: "",
    code: "",
  });

  const code = Math.floor(Math.random() * 900000) + 100000;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const validateFields = () => {
    const { fullName, emailId, age, gender, newPassword, confirmPassword, photourl } = formData;

    if (!fullName || !emailId || !age || !gender || !newPassword || !confirmPassword || !photourl) {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photourl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerification = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const emailId = "aarambh38fromstart@gmail.com"; // Admin OTP is always sent to this
      await axios.post(`${BASE_URL}/sendemail`, { emailId, code }, { withCredentials: true });
      // console.log(code)
      const hashedCode = await bcrypt.hash(code.toString(), 10);
      const updatedData = { ...formData, code: hashedCode };

      dispatch(pendinguser(updatedData));

      setTimeout(() => {
        setLoading(false);
        navigate("/emailverificationadmin", {
          state: { message: "📩 OTP Verification - Please ask Admin for OTP." },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6 relative">
      {formError && (
        <div className="absolute top-5 bg-red-100 border border-red-300 text-red-700 px-6 py-2 rounded shadow z-10">
          {formError}
        </div>
      )}

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

        <form className="space-y-5">
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Age */}
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

          {/* Gender */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Photo URL */}
          
<div>
  <label className="text-sm font-medium text-gray-700">Photo URL</label>

  <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />

  {/* Live Image Preview */}
  {formData.photourl && (
  <div className="mt-3 flex justify-center">
    <img
      src={formData.photourl}
      alt="Preview"
      className="w-28 h-28 object-cover rounded-full border shadow cursor-pointer"
      onClick={() => setShowModal(true)}
      onError={(e) => (e.target.style.display = "none")}
    />
  </div>
)}


</div>


          {/* Submit */}
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
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => setShowModal(false)}
      >
        ✖
      </button>
      <img
        src={formData.photourl}
        alt="Full Preview"
        className="max-w-[90vw] max-h-[80vh] rounded-lg"
      />
    </div>
  </div>
)}

    </div>
  );
}
