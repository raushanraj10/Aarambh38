import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pendinguser } from "./utils/EmailSlice";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import governmentEngineeringColleges from "./constants/CollegeList";
import Select from "react-select";
import Shimmer from "./Shimmer"; // Make sure this component is styled and exists

export default function SignupPageUser() {
  const code = Math.floor(Math.random() * 900000) + 100000;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // shimmer loading state

  const [formData, setFormData] = useState({
    fullName: "abc",
    emailId: "r661157@gmail.com",
    collegeName: "Bakhtiyarpur Engineering College (BEC), Bakhtiyarpur",
    registration: "1234",
    age: "22",
    gender: "Male",
    newPassword: "1234",
    confirmPassword: "1234",
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
      await axios.post(
        "http://localhost:5000/sendemail",
        { emailId, code },
        { withCredentials: true }
      );

      const hashedCode = await bcrypt.hash(code.toString(), 10);
      const updatedFormData = { ...formData, code: hashedCode };

      dispatch(pendinguser(updatedFormData));

      // Delay shimmer just to simulate better UX
      setTimeout(() => {
        setLoading(false);
        navigate("/emailverificationuser", {
        state: { message: `📩 OTP sent to ${formData.emailId}` },
        });

      }, 1000);
    } catch (err) {
      console.error("Email verification error:", err);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Student Account
        </h2>
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
            <label className="text-sm font-medium text-gray-700">College Name</label>
            <Select
              options={collegeOptions}
              onChange={handleCollegeSelect}
              defaultValue={{ label: formData.collegeName, value: formData.collegeName }}
              placeholder="Select your college"
              className="mt-1"
              classNames={{
                control: () => "border rounded-lg px-2 py-1",
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="number"
              name="registration"
              value={formData.registration}
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
              minLength={3}
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

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
