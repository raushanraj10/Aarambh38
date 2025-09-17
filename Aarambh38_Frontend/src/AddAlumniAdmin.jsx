
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Select from "react-select";
import governmentEngineeringColleges from "./constants/CollegeList";
import Shimmer from "./Shimmer";
import { BASE_URL } from "./constants/AllUrl";
import BranchList from "./constants/BranchList";
import { useSelector } from "react-redux";

export default function AddAlumniAdmin() {
  const AdminData = useSelector((store) => store.admindata);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); // success/error
  const [formErrors, setFormErrors] = useState({});
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); // confirmation modal

  useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    collegeName: AdminData.collegeName
  }));
}, [AdminData.collegeName]);


  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    collegeName: "",
    registration: "",
    batch: "",
    company: "",
    role: "",
    gender: "",
    branch: "",
    newPassword: "",
    confirmPassword: "",
    gate: "",
    about: "",
    photourl: "",
    collegeReview: "", 
  });

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const collegeOptions = governmentEngineeringColleges.map((college) => ({
    value: college,
    label: college,
  }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // const handleCollegeSelect = (selectedOption) => {
  //   setFormData({ ...formData, collegeName: selectedOption.value });
  //   setFormErrors((prev) => ({ ...prev, collegeName: "" }));
  // };

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "code" && key !== "gate") {
        errors[key] = "This field is required.";
      }
    });

    if (formData.emailId && !emailRegex.test(formData.emailId)) {
      errors.emailId = "📧 Please enter a valid email address.";
    }

    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (formData.registration && formData.registration.length !== 11) {
      errors.registration = "Registration number must be exactly 11 digits.";
    }

    if (formData.batch && formData.batch.length !== 4) {
      errors.batch = "Batch must be exactly 4 digits.";
    }

    return errors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photourl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // open confirmation modal
  const handleVerification = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToast({ message: "❌ Please correct the highlighted errors.", type: "error" });
      return;
    }
    setConfirmModalOpen(true);
  };

  // confirm submission
  const handleConfirmSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setConfirmModalOpen(false);

    try {
      const { fullName, emailId, collegeName, registration, batch, company, role, gender, branch, newPassword, confirmPassword, gate, about, photourl ,collegeReview} = formData;

      await axios.post(
        `${BASE_URL}/alumniaddbyadmin`,
        { fullName, emailId, collegeName, registration, batch, company, role, gender, branch, newPassword, confirmPassword, gate, about, photourl,collegeReview },
        { withCredentials: true }
      );

      setToast({ message: `✅ Alumni added successfully!`, type: "success" });
    } catch (error) {
      console.error("Submission error:", error);
      setToast({ message: "⚠️ Failed to add alumni.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-100 to-indigo-200 flex items-center justify-center px-4 py-12 relative">
  

      {/* Toast message centered */}
      {toast.message && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-3 rounded-lg text-white font-semibold shadow-lg
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <div className="relative text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-800 relative inline-block px-6 py-2">
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-transparent bg-clip-text drop-shadow-lg">
              {AdminData?.collegeName}
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></span>
          </h2>
        </div>
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Add Alumni To संyukt38</span>
        </h2>
        {/* <p className="text-center text-gray-600 text-sm mb-6">
          🎓 Where journeys begin and stories inspire. Join the alumni network today and make a difference!
        </p> */}

        {/* Form fields */}
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
    <div
      key={field}
      className={`col-span-1 ${
        field === "photourl" ? "md:col-span-2 order-last" : ""
      }`}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field
          .replace(/([A-Z])/g, " $1")
          .replace("Id", " ID")
          .replace(/\b\w/g, (c) => c.toUpperCase())}
      </label>

      {/* Registration Number (only 11 digits) */}
     {field === "registration" ? (
  // Registration Number (must be exactly 11 digits)
  <input
    type="text"
    name="registration"
    value={formData.registration}
    onChange={(e) => {
      let onlyNums = e.target.value.replace(/[^0-9]/g, ""); // allow only numbers
      if (onlyNums.length > 11) onlyNums = onlyNums.slice(0, 11); // restrict to 11
      handleChange({ target: { name: "registration", value: onlyNums } });
    }}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
      formErrors.registration
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    required
    minLength={11}
    maxLength={11}
    pattern="\d{11}"
    placeholder="Enter 11-digit registration no."
  />
) : field === "batch" ? (
  // Batch (must be exactly 4 digits)
  <input
    type="text"
    name="batch"
    value={formData.batch}
    onChange={(e) => {
      let onlyNums = e.target.value.replace(/[^0-9]/g, ""); // allow only numbers
      if (onlyNums.length > 4) onlyNums = onlyNums.slice(0, 4); // restrict to 4
      handleChange({ target: { name: "batch", value: onlyNums } });
    }}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
      formErrors.batch
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    required
    minLength={4}
    maxLength={4}
    pattern="\d{4}"
    placeholder="e.g. 2025"
  />
)  : field !== "photourl" ? (
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
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />

          {formData.photourl && (
            <div className="mt-4 flex justify-center">
              <img
                src={formData.photourl}
                alt="Preview"
                className="h-32 w-32 rounded-full object-cover border border-gray-300 shadow cursor-pointer transition-transform hover:scale-105"
                onClick={() => setImageModalOpen(true)}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </>
      )}
    </div>
  ))}

<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    College Name
  </label>
  <Select
    options={collegeOptions}
    value={collegeOptions.find(
      (option) => option.value === AdminData.collegeName
    ) || null}
    onChange={() => {}}
    isDisabled={true} // disable editing
    className="mt-1"
    styles={{
      control: (base) => ({
        ...base,
        backgroundColor: "#f9fafb", // optional: gray out to indicate read-only
        borderColor: formErrors.collegeName ? "red" : "#d1d5db",
        boxShadow: formErrors.collegeName
          ? "0 0 0 2px rgba(239,68,68,.5)"
          : "",
      }),
    }}
  />
  {formErrors.collegeName && (
    <p className="text-xs text-red-500 mt-1">{formErrors.collegeName}</p>
  )}
</div>




  {/* Gender */}
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

  {/* Branch */}
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

{/* GATE Qualification (Optional) */}
<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    GATE Qualification (Optional)
  </label>
  <select
    name="gate"
    value={formData.gate}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
      formErrors.gate
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
  >
    <option value="">Select</option>
    <option value="Qualified">Qualified</option>
    {/* <option value="Not Qualified">Not Qualified</option> */}
  </select>
  {formErrors.gate && (
    <p className="text-xs text-red-500 mt-1">{formErrors.gate}</p>
  )}
</div>


  {/* About */}
 <div className="col-span-1 md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    About
  </label>
  <p className="text-xs text-gray-500 mb-1">
    Please share your journey line by line (Internship, Experience, Achievements, Guidance).
  </p>
  <textarea
    name="about"
    rows={6}
    value={formData.about}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none whitespace-pre-line ${
      formErrors.about
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    placeholder={`1. Internship: Infosys, Summer 2022 (Frontend Developer)
2. Full-time Experience: TCS (2022–2024), Google (2024–present)
3. Achievements: GATE qualified, 5⭐ HackerRank in Problem Solving
4. Guidance: Happy to help with resume building, DSA, project selection`}
    required
  />
  {formErrors.about && (
    <p className="text-xs text-red-500 mt-1">{formErrors.about}</p>
  )}
</div>

{/* College Review */}
<div className="col-span-1 md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    College Review
  </label>
  <textarea
    name="collegeReview"
    rows={4}
    value={formData.collegeReview}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none whitespace-pre-line ${
      formErrors.collegeReview
        ? "border-red-500 ring-2 ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
    placeholder="Share your honest review about your college experience..."
    required
  />
  {formErrors.collegeReview && (
    <p className="text-xs text-red-500 mt-1">{formErrors.collegeReview}</p>
  )}
</div>


  {/* Password */}
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
      minLength={6}
    />
    <div
      className="absolute right-3 top-9 text-gray-500 cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </div>
    {formErrors.newPassword && (
      <p className="text-xs text-red-500 mt-1">{formErrors.newPassword}</p>
    )}
  </div>

  {/* Confirm Password */}
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
          disabled={loading}
          className={`mt-8 w-full py-3 rounded-lg font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {loading ? "Processing..." : "Sign Up & Verify Email"}
        </button>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setImageModalOpen(false)}
        >
          <img
            src={formData.photourl}
            alt="Enlarged Preview"
            className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
      
      {/* Photo at top */}
      {formData.photourl && (
        <div className="flex justify-center mb-6">
          <img
            src={formData.photourl}
            alt="Alumni Photo"
            className="h-32 w-32 rounded-full object-cover border-2 border-gray-300 shadow-lg"
          />
        </div>
      )}

      <h3 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        CONFIRM ALUMNI DETAILS
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto text-sm text-gray-700">
        {Object.entries(formData).map(([key, value]) => {
          if (["confirmPassword", "photourl"].includes(key)) return null;
          if (key === "newPassword") key = "Password";

          return (
            <p key={key} className="flex justify-between border-b border-gray-200 py-1">
              <span className="font-semibold">{key.replace(/([A-Z])/g, " $1").toUpperCase()}:</span>
              <span>{value || "-"}</span>
            </p>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => setConfirmModalOpen(false)}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium transition"
        >
          EDIT
        </button>
        <button
          onClick={handleConfirmSubmit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "SUBMITTING..." : "CONFIRM"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

