import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addalumini } from "./utils/AluminiSlice";
import { BASE_URL } from "./constants/AllUrl";

const EditProfileAlumni = () => {
  const alumniData = useSelector((store) => store.aluminidata);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    collegeName: "",
    company: "",
    role: "",
    about: "",
    gender: "",
    photourl: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    if (!alumniData || !alumniData.emailId) {
      navigate("/loginselectorpage");
    } else {
      setFormData({
        fullName: alumniData.fullName || "",
        email: alumniData.emailId || "",
        collegeName: alumniData.collegeName || "",
        company: alumniData.company || "",
        role: alumniData.role || "",
        about: alumniData.about || "",
        gender: alumniData.gender || "",
        photourl: alumniData.photourl || "",
      });
    }
  }, [alumniData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, company, gender, role, about, photourl } = formData;

    try {
      const res = await axios.patch(
  `${BASE_URL}/editalumni`,
  { fullName, company, gender, role, about, photourl },
  { withCredentials: true }
);


      setMessage("✅ Profile updated successfully.");
      setMessageType("success");
      dispatch(addalumini(res.data));
    } catch (err) {
      setMessage("❌ Failed to update profile.");
      setMessageType("error");
      console.error(err);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow-md flex flex-col md:flex-row gap-10 relative">
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Edit Alumni Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={formData.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            placeholder="Email"
            type="email"
          />
          <input
            name="collegeName"
            value={formData.collegeName}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            placeholder="College Name"
          />
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Company"
          />
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Role (e.g., Software Engineer)"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="About You"
            rows={3}
          />
          <input
            name="photourl"
            value={formData.photourl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Photo URL"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Live Preview */}
      <div className="w-full md:w-1/2 bg-gray-50 p-5 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">Live Preview</h3>
        <div className="flex flex-col items-center text-center">
          <img
            src={formData.photourl || "https://via.placeholder.com/100"}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border mb-4"
          />
          <p className="text-lg font-bold">{formData.fullName || "Full Name"}</p>
          <p className="text-sm text-gray-500">{formData.role || "Your Role"}</p>
          <p className="text-sm text-gray-600">{formData.company || "Company"}</p>
          <p className="text-sm text-gray-600">{formData.collegeName || "College Name"}</p>
          <p className="text-sm text-gray-600">{formData.gender || "Gender"}</p>
          <p className="text-sm text-gray-600">{formData.branch || "Branch"}</p>
          <p className="text-sm text-gray-500 mt-3 px-4">{formData.about || "About..."}</p>
          <p className="text-xs text-gray-400 mt-2">{formData.email || "Email Address"}</p>
        </div>
      </div>

      {/* Toast Popup */}
      {message && (
        <div
          className={`fixed bottom-5 right-5 px-5 py-3 rounded shadow-md text-white z-50 transition-all duration-300 ${
            messageType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default EditProfileAlumni;
