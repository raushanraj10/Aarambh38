import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pendinguser } from "./utils/EmailSlice";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPageAlumini() {
  const code = Math.floor(Math.random() * 900000) + 100000;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "abc",
    emailId: "r661157@gmail.com",
    collegeName: "abc",
    registration: "123",
    batch: "2022",
    company: "Google",
    role: "Manager",
    gender: "Male",
    newPassword: "1234",
    confirmPassword: "1234",
    about: "I Am Alumini",
    photourl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Education%2C_Studying%2C_University%2C_Alumni_-_icon.png/2048px-Education%2C_Studying%2C_University%2C_Alumni_-_icon.png",
    code: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const HandleVerification = async () => {
    const { emailId } = formData;
    console.log(code)
    const res = await axios.post("http://localhost:5000/sendemail", { emailId, code }, { withCredentials: true });
    const hashedCode = await bcrypt.hash(code.toString(), 10);
    const updatedFormData = { ...formData, code: hashedCode };
    setFormData(updatedFormData);
    dispatch(pendinguser(updatedFormData));
    return navigate("/emailverificationalumini");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Create Alumni Account
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["Full Name", "fullName", "text"],
            ["Email", "emailId", "email"],
            ["College Name", "collegeName", "text"],
            ["Registration Number", "registration", "text"],
            ["Batch", "batch", "number"],
            ["Company Name", "company", "text"],
            ["Role in Company", "role", "text"],
            ["Photo URL", "photourl", "text"]
          ].map(([label, name, type]) => (
            <div key={name} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

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

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea
              name="about"
              rows={4}
              value={formData.about}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write something about yourself..."
              required
            ></textarea>
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
          onClick={HandleVerification}
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
