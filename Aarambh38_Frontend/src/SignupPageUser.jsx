import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pendinguser } from "./utils/EmailSlice";
import { useDispatch } from "react-redux";
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

  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    collegeName: "",
    branch: "",
    registration: "",
    batch: "",
    age: "",
    gender: "",
    newPassword: "",
    confirmPassword: "",
    photourl: "",
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) errors[key] = "This field is required.";
    });

    if (!emailRegex.test(formData.emailId)) {
      errors.emailId = "📧 Please enter a valid email address.";
    }

    if (isNaN(formData.age) || formData.age <= 0) {
      errors.age = "Enter a valid age.";
    }

    if (!/^\d{11}$/.test(formData.registration)) {
      errors.registration = "Registration number must be exactly 11 digits.";
    }

    if (!/^\d{4}$/.test(formData.batch)) {
      errors.batch = "Batch must be exactly 4 digits (e.g., 2025).";
    }

    if (!formData.photourl) {
      errors.photourl = "Please upload your photo.";
    }

    if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters.";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
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
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setPopupMessage("❌ Please fix the errors.");
      return;
    }

    setLoading(true);
    try {
      const { emailId } = formData;
      await axios.post(`${BASE_URL}/sendemail`, { emailId }, { withCredentials: true });
      const updatedFormData = { ...formData };

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
    type="text"
    name="registration"
    value={formData.registration}
    onChange={(e) => {
      const onlyNums = e.target.value.replace(/[^0-9]/g, ""); // only numbers
      setFormData({ ...formData, registration: onlyNums });
    }}
    maxLength={11}
    minLength={11}
    pattern="\d{11}"
    className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
      formErrors.registration
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    required
  />
  {formErrors.registration && (
    <p className="text-xs text-red-500 mt-1">{formErrors.registration}</p>
  )}
</div>


          {/* Batch */}
          <div>
  <label className="text-sm font-medium text-gray-700">Batch</label>
  <input
    type="text"
    name="batch"
    value={formData.batch}
    onChange={(e) => {
      const onlyNums = e.target.value.replace(/[^0-9]/g, ""); // only numbers
      setFormData({ ...formData, batch: onlyNums });
    }}
    maxLength={4}
    minLength={4}
    pattern="\d{4}"
    className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
      formErrors.batch
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    required
  />
  {formErrors.batch && (
    <p className="text-xs text-red-500 mt-1">{formErrors.batch}</p>
  )}
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
              minLength={6}
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

          {/* Photo Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
            />
            {formErrors.photourl && (
              <p className="text-xs text-red-500 mt-1">{formErrors.photourl}</p>
            )}
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
