import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pendinguser } from "./utils/EmailSlice";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import governmentEngineeringColleges from "./constants/CollegeList";
import Shimmer from "./Shimmer";
import { BASE_URL } from "./constants/AllUrl";
import { removestudent } from "./utils/StudentSlice";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";
import BranchList from "./constants/BranchLIst";

export default function SignupPageAlumini() {
  const Dispatch = useDispatch();
  useEffect(() => {
    Dispatch(removestudent());
    Dispatch(removeadmin());
    Dispatch(removealumini());
  }, []);

  const code = Math.floor(Math.random() * 900000) + 100000;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "abc",
    emailId: "r661157@gmail.com",
    collegeName: "Bakhtiyarpur Engineering College (BEC), Bakhtiyarpur",
    registration: "123",
    batch: "2022",
    company: "google",
    role: "manager",
    gender: "Male",
    branch: "Computer Science and Engineering (CSE)",
    newPassword: "1234",
    confirmPassword: "1234",
    about: "I am alumini",
    photourl: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcS0sQet7d_2RAgQyBQM092dn1Uo-N9Gk3xAdQV7YrSczH-LhdzZYeWIWfVE8B6sIvn1x6SZCpjN5TfBUe8",
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

  const selectedCollege = collegeOptions.find(
    (option) => option.value === formData.collegeName
  );

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
      setPopupMessage("❌ Please correct the highlighted errors.");
      return;
    }

    setLoading(true);
    try {
      const { emailId } = formData;

      await axios.post(
        `${BASE_URL}/sendemail`,
        { emailId, code },
        { withCredentials: true }
      );
      console.log(code)
      const hashedCode = await bcrypt.hash(code.toString(), 10);
      const updatedFormData = { ...formData, code: hashedCode };

      dispatch(pendinguser(updatedFormData));
      setPopupMessage(`📩 OTP sent to ${emailId}`);

      setTimeout(() => {
        setLoading(false);
        navigate("/emailverificationalumini", {
          state: { message: `📩 OTP sent to ${emailId}` },
        });
      }, 1000);
    } catch (error) {
      console.error("OTP send error:", error);
      setPopupMessage("⚠️ Failed to send verification email.");
      setLoading(false);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-[#eaf3fb] flex items-center justify-center px-4 py-12 relative">
      {popupMessage && (
        <div className="absolute top-5 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-2 rounded shadow-md">
          {popupMessage}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-2">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Aarambh38
          </span>
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          🎓 Where journeys begin and stories inspire. Join the alumni network
          today and make a difference!
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "fullName",
            "emailId",
            "registration",
            "batch",
            "company",
            "role",
            "photourl",
          ].map((field) => (
            <div key={field} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace("Id", " ID")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <input
                type={field === "emailId" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  formErrors[field]
                    ? "border-red-500 ring-2 ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
                required
              />
              {formErrors[field] && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors[field]}
                </p>
              )}
            </div>
          ))}

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Name
            </label>
            <Select
              options={collegeOptions}
              onChange={handleCollegeSelect}
              value={selectedCollege}
              className="mt-1"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: formErrors.collegeName ? "red" : "#d1d5db",
                  boxShadow: formErrors.collegeName
                    ? "0 0 0 2px rgba(239,68,68,.5)"
                    : "",
                }),
              }}
            />
            {formErrors.collegeName && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.collegeName}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                formErrors.gender
                  ? "border-red-500 ring-2 ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.gender && (
              <p className="text-xs text-red-500 mt-1">{formErrors.gender}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                formErrors.branch
                  ? "border-red-500 ring-2 ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
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
            {formErrors.branch && (
              <p className="text-xs text-red-500 mt-1">{formErrors.branch}</p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none ${
                formErrors.about
                  ? "border-red-500 ring-2 ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              placeholder="Write something about yourself..."
              required
            />
            {formErrors.about && (
              <p className="text-xs text-red-500 mt-1">{formErrors.about}</p>
            )}
          </div>

          <div className="col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                formErrors.newPassword
                  ? "border-red-500 ring-2 ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
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
            {formErrors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.newPassword}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                formErrors.confirmPassword
                  ? "border-red-500 ring-2 ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
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
          <a href="/loginselectorpage" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
