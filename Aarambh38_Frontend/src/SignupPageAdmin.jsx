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
    photourl: "data:image/png;base64,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",
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
    type="text"
    name="photourl"
    value={formData.photourl}
    onChange={handleChange}
    placeholder="https://example.com/photo.jpg"
    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
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
