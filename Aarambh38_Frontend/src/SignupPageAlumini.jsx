import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pendinguser } from "./utils/EmailSlice";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import governmentEngineeringColleges from "./constants/CollegeList";
import Shimmer from "./Shimmer"; // Make sure this exists

export default function SignupPageAlumini() {
  const code = Math.floor(Math.random() * 900000) + 100000;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "abc",
    emailId: "r661157@gmail.com",
    collegeName: "Bakhtiyarpur Engineering College (BEC), Bakhtiyarpur",
    registration: "123",
    batch: "2024",
    company: "google",
    role: "manager",
    gender: "Male",
    newPassword: "1234",
    confirmPassword: "1234",
    about: "abc",
    photourl: "https://www.shutterstock.com/image-vector/school-graduation-hat-cartoon-diploma-600nw-2355557719.jpg",
    code: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollegeSelect = (selectedOption) => {
    setFormData({ ...formData, collegeName: selectedOption.value });
  };

  const handleVerification = async () => {
    console.log(code)
    setLoading(true);
    try {
      const { emailId } = formData;
      await axios.post("http://localhost:5000/sendemail", { emailId, code }, { withCredentials: true });

      const hashedCode = await bcrypt.hash(code.toString(), 10);
      const updatedFormData = { ...formData, code: hashedCode };

      setFormData(updatedFormData);
      dispatch(pendinguser(updatedFormData));

      // Show shimmer for UX
      setTimeout(() => {
        setLoading(false);
        navigate("/emailverificationalumini", {
           state: { message: `📩 OTP sent to ${formData.emailId}` },
         });

      }, 1000);
    } catch (error) {
      console.error("Verification error:", error);
      alert("Failed to send verification email.");
      setLoading(false);
    }
  };

  const collegeOptions = governmentEngineeringColleges.map((college) => ({
    value: college,
    label: college,
  }));

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Create Alumni Account
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["fullName", "emailId", "registration", "batch", "company", "role", "photourl"].map((field) => (
            <div key={field} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace("Id", " ID")
                  .replace("Url", " URL")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <input
                type={field === "emailId" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
            <Select
              options={collegeOptions}
              onChange={handleCollegeSelect}
              defaultValue={{
                label: formData.collegeName,
                value: formData.collegeName,
              }}
              placeholder="Select your college"
              className="mt-1"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea
              name="about"
              rows={4}
              value={formData.about}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write something about yourself..."
              required
            />
          </div>

          <div className="col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={3}
            />
            <div
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </form>

        <button
          type="button"
          onClick={handleVerification}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Sign Up & Verify Email
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
