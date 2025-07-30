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
import BranchList from "./constants/BranchList";

export default function SignupPageUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const code = Math.floor(Math.random() * 900000) + 100000;

  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    collegeName: "",
    registration: "",
    age: "",
    gender: "",
    newPassword: "",
    confirmPassword: "",
    branch: "",
    photourl: "data:image/png;base64,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",
    code: "",
  });

  useEffect(() => {
    dispatch(removestudent());
    dispatch(removeadmin());
    dispatch(removealumini());
  }, []);

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
      // console.log(code)
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

          {/* College */}
          <div>
            <label className="text-sm font-medium text-gray-700">College Name</label>
            <Select
              options={collegeOptions}
              onChange={handleCollegeSelect}
              defaultValue={formData.collegeName && { label: formData.collegeName, value: formData.collegeName }}
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

          {/* Branch */}
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

          {/* Registration */}
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

          {/* Photo URL */}
          
{/* Photo URL */}
{/* Photo URL */}
<div>
  <label className="text-sm font-medium text-gray-700">Photo URL</label>
  <input
    type="text"
    name="photourl"
    placeholder="Enter photo URL (e.g., https://...)"
    value={formData.photourl}
    onChange={handleChange}
    className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
      formErrors.photourl
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    required
  />
  {formErrors.photourl && (
    <p className="text-xs text-red-500 mt-1">{formErrors.photourl}</p>
  )}

  {/* 👇 Centered image preview with click-to-enlarge */}
  {formData.photourl && (
    <div className="mt-3 flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-1">Photo Preview:</p>
      <div
        className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow cursor-pointer hover:scale-105 transition"
        onClick={() => setShowImageModal(true)}
      >
        <img
          src={formData.photourl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )}
</div>

{/* Image Modal */}
{showImageModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
    onClick={() => setShowImageModal(false)}
  >
    <div
      className="max-w-[90vw] max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={formData.photourl}
        alt="Enlarged Preview"
        className="rounded-lg shadow-lg max-h-[90vh] max-w-full"
      />
    </div>
    <button
      onClick={() => setShowImageModal(false)}
      className="absolute top-5 right-5 text-white text-2xl font-bold"
    >
      &times;
    </button>
  </div>
)}



          {/* Submit Button */}
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
