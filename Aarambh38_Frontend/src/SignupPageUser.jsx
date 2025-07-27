import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pendinguser } from "./utils/EmailSlice";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import governmentEngineeringColleges from "./constants/CollegeList";
import Select from "react-select";
import Shimmer from "./Shimmer";
import { BASE_URL } from "./constants/AllUrl";
import { removestudent } from "./utils/StudentSlice";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";
import BranchList from "./constants/BranchLIst";

export default function SignupPageUser() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "abc",
    emailId: "raushan@gmail.com",
    collegeName: "Bakhtiyarpur Engineering College (BEC), Bakhtiyarpur",
    registration: "123",
    age: "123",
    gender: "Male",
    newPassword: "1234",
    confirmPassword: "1234",
    branch:"Computer Science and Engineering (CSE)",
    code: "",
  });

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  const collegeOptions = governmentEngineeringColleges.map((college) => ({
    value: college,
    label: college,
  }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleCollegeSelect = (selectedOption) => {
    setFormData({ ...formData, collegeName: selectedOption.value });
    setFormErrors((prev) => ({ ...prev, collegeName: "" }));
  };

  const validateFields = () => {
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "code") errors[key] = "This field is required.";
    });

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const handleVerification = async () => {
    
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setPopupMessage("❌ Please fix the errors.");
      return;
    }

    setLoading(true);
    try {
      const { emailId } = formData;
      await axios.post(`${BASE_URL}/sendemail`, { emailId, code }, { withCredentials: true });

     console.log(code)
      const hashedCode = await bcrypt.hash(code.toString(), 10);
      const updatedFormData = { ...formData, code: hashedCode };

      dispatch(pendinguser(updatedFormData));
      setPopupMessage(`📩 OTP sent to ${emailId}`);

      setTimeout(() => {
        setLoading(false);
        navigate("/emailverificationuser", {
          state: { message: `📩 OTP sent to ${emailId}` },
        });
      }, 1000);
    } catch (err) {
      console.error("Email verification error:", err);
      setPopupMessage("⚠️ Failed to send verification email.");
      setLoading(false);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-[#eaf3fb] flex items-center justify-center p-6 relative">
      {/* Floating popup */}
      {popupMessage && (
        <div className="absolute top-5 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-2 rounded shadow-md z-10">
          {popupMessage}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-2">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Aarambh38
          </span>
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          🚀 Start your journey of learning and connection with alumni mentors today.
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
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.fullName ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
            {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.emailId ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
            {formErrors.emailId && <p className="text-xs text-red-500 mt-1">{formErrors.emailId}</p>}
          </div>

          {/* College Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">College Name</label>
            <Select
              options={collegeOptions}
              onChange={handleCollegeSelect}
              defaultValue={{ label: formData.collegeName, value: formData.collegeName }}
              placeholder="Select your college"
              className="mt-1"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: formErrors.collegeName ? "red" : "#d1d5db",
                  boxShadow: formErrors.collegeName ? "0 0 0 2px rgba(239,68,68,.5)" : "",
                }),
              }}
            />
            {formErrors.collegeName && <p className="text-xs text-red-500 mt-1">{formErrors.collegeName}</p>}
          </div>


           <div>
  <label className="text-sm font-medium text-gray-700">Branch</label>
  <select
    name="branch"
    value={formData.branch}
    onChange={handleChange}
    className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
      formErrors.branch ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    required
  >
    <option value="">Select Branch</option>
    {BranchList.map((branch) => (
      <option key={branch} value={branch}>
        {branch}
      </option>
    ))}
  </select>
  {formErrors.branch && <p className="text-xs text-red-500 mt-1">{formErrors.branch}</p>}
</div>



          {/* Registration Number */}
          <div>
            <label className="text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="number"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.registration ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
            {formErrors.registration && <p className="text-xs text-red-500 mt-1">{formErrors.registration}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.age ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
            {formErrors.age && <p className="text-xs text-red-500 mt-1">{formErrors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.gender ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.gender && <p className="text-xs text-red-500 mt-1">{formErrors.gender}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.newPassword ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
              minLength={3}
            />
            <div
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
            {formErrors.newPassword && <p className="text-xs text-red-500 mt-1">{formErrors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                formErrors.confirmPassword ? "border-red-500 ring-2 ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
            {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>}
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
    </div>
  );
}
