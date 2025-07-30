import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addstudent } from "./utils/StudentSlice";
import { BASE_URL } from "./constants/AllUrl";

const EditProfileUser = () => {
  const studentData = useSelector((store) => store.studentdata);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    collegeName: "",
    age: "",
    gender: "",
    photourl: "",
    branch: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentData || !studentData.emailId) {
      navigate("/loginselectorpage");
    } else {
      setFormData({
        fullName: studentData.fullName || "",
        emailId: studentData.emailId || "",
        collegeName: studentData.collegeName || "",
        gender: studentData.gender || "",
        age: studentData.age || "",
        photourl: studentData.photourl || "",
        branch: studentData.branch || ""
      });
    }
  }, [studentData]);

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
    setLoading(true);
    const { fullName, age, gender, photourl, branch } = formData;

    try {
      const res = await axios.post(
        `${BASE_URL}/edituser`,
        { fullName, age, gender, photourl, branch },
        { withCredentials: true }
      );

      setMessage("You have successfully updated the profile.");
      setMessageType("success");
      dispatch(addstudent(res.data));
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
    <div className="max-w-7xl mx-auto mt-10 p-4 md:p-6 bg-white rounded shadow-md flex flex-col md:flex-row gap-6 md:gap-10 relative">
      {/* Left Side: Form */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Full Name"
          />
          <input
            name="emailId"
            value={formData.emailId}
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
            name="branch"
            value={formData.branch}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            placeholder="Branch"
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
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Age"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Right Side: Live Preview */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full bg-gray-50 p-4 rounded-lg shadow overflow-hidden min-h-[400px] flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-[length:300%_100%] bg-clip-text text-transparent animate-shimmer tracking-wide mb-4">
                Aarambh38
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium animate-pulse">
                Stay motivated and please wait...
              </p>
            </div>
          ) : (
            <div className="w-full">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">Live Preview</h3>
              <div className="flex flex-col items-center text-center">
                <div className="w-36 h-36 md:w-48 md:h-48 mb-4 cursor-pointer" onClick={() => setShowImageModal(true)}>
                  <img
                    src={formData.photourl || "https://via.placeholder.com/150"}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover border border-gray-300 shadow transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-lg font-bold">{formData.fullName || "Full Name"}</p>
                <p className="text-sm text-gray-500">{formData.age || "Your Age"}</p>
                <p className="text-sm text-gray-600 mt-1">{formData.collegeName || "College Name"}</p>
                <p className="text-sm text-gray-500 mt-3 px-4">{formData.gender || "Short Bio..."}</p>
                <p className="text-xs text-gray-400 mt-2">{formData.emailId || "Email Address"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={formData.photourl}
            alt="Full Size"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}

      {/* Toast */}
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

export default EditProfileUser;
