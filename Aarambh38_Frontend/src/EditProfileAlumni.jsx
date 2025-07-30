import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addalumini } from "./utils/AluminiSlice";
import { BASE_URL } from "./constants/AllUrl";
import Shimmer from "./Shimmer";

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showImageModal, setShowImageModal] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, company, gender, role, about, photourl } = formData;
    setLoading(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/editalumni`,
        { fullName, company, gender, role, about, photourl },
        { withCredentials: true }
      );

      setMessage("Profile updated successfully.");
      setMessageType("success");
      dispatch(addalumini(res.data));
    } catch (err) {
      setMessage("Failed to update profile.");
      setMessageType("error");
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-10 relative">
      {/* Form Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-semibold mb-6 text-blue-700 text-center">
          Edit Alumni Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={formData.email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="Email"
            type="email"
          />
          <input
            name="collegeName"
            value={formData.collegeName}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="College Name"
          />
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company"
          />
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Role (e.g., Software Engineer)"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="About You"
            rows={4}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">
          Live Preview
        </h3>

        {loading ? (
          <Shimmer />
        ) : (
          <div className="flex flex-col items-center text-center">
            <img
              src={formData.photourl || "https://via.placeholder.com/100"}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover border-2 border-blue-500 mb-4 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowImageModal(true)}
            />
            <p className="text-lg font-bold">{formData.fullName || "Full Name"}</p>
            <p className="text-sm text-gray-600">{formData.role || "Your Role"}</p>
            <p className="text-sm text-gray-600">{formData.company || "Company"}</p>
            <p className="text-sm text-gray-600">{formData.collegeName || "College Name"}</p>
            <p className="text-sm text-gray-600">{formData.gender || "Gender"}</p>
            <p className="text-sm text-gray-500 mt-2 px-4">{formData.about || "About..."}</p>
            <p className="text-xs text-gray-400 mt-2">{formData.email || "Email Address"}</p>
          </div>
        )}
      </div>

      {/* Toast Message */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-md text-white z-50 transition-all duration-300 ${
            messageType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <img
            src={formData.photourl}
            alt="Full Preview"
            className="max-w-full max-h-full rounded shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default EditProfileAlumni;
