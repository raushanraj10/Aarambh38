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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (!alumniData) {
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
      const res = await axios.post(
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
    <div className="max-w-6xl mx-auto mt-6 px-4 md:px-8 py-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-8 relative overflow-hidden">
      {/* Form Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
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
            rows={3}
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
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Preview or Shimmer */}
      <div className="w-full md:w-1/2 bg-gray-50 p-4 md:p-6 rounded-xl shadow-md flex justify-center items-center">
        {loading ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-shimmer tracking-wide mb-4">
              Aarambh38
            </h1>
            <p className="text-base text-gray-600 font-medium animate-pulse">
              Stay motivated and please wait...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-1">
            <img
              src={formData.photourl || "https://via.placeholder.com/100"}
              alt="Preview"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-500 mb-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowImageModal(true)}
            />
            <p className="text-lg font-bold">{formData.fullName || "Full Name"}</p>
            <p className="text-sm text-gray-600">{formData.role || "Your Role"}</p>
            <p className="text-sm text-gray-600">{formData.company || "Company"}</p>
            <p className="text-sm text-gray-600">{formData.collegeName || "College Name"}</p>
            <p className="text-sm text-gray-600">{formData.gender || "Gender"}</p>
            <p className="text-sm text-gray-500 px-2">{formData.about || "About..."}</p>
            <p className="text-xs text-gray-400">{formData.email || "Email Address"}</p>
          </div>
        )}
      </div>

      {/* Toast Message */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 px-5 py-2.5 rounded-md text-white shadow-lg z-50 transition-all duration-300 ${
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
            className="max-w-[90%] max-h-[90%] rounded shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default EditProfileAlumni;
