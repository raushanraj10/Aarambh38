import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addadmin } from "./utils/AdminSlice";
import { BASE_URL } from "./constants/AllUrl";

const EditProfileAdmin = () => {
  const AdminData = useSelector((store) => store.admindata);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    collegeName: "",
    age: "",
    gender: "",
    photourl: "",
    mobileNumber: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!AdminData) {
      navigate("/loginselectorpage");
    } else {
      setFormData({
        fullName: AdminData.fullName || "",
        emailId: AdminData.emailId || "",
        collegeName: AdminData.collegeName || "",
        gender: AdminData.gender || "",
        age: AdminData.age || "",
        photourl: AdminData.photourl || "https://via.placeholder.com/100",
        mobileNumber: AdminData?.mobileNumber || "",
      });
    }
  }, [AdminData]);

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
    const { fullName, age, gender, photourl, mobileNumber } = formData;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/editadmin`,
        { fullName, age, gender, photourl, mobileNumber },
        { withCredentials: true }
      );

      setMessage("Profile updated successfully.");
      setMessageType("success");
      dispatch(addadmin(res.data));
    } catch (err) {
      setMessage("Failed to update profile.");
      setMessageType("error");
      console.error(err);
    } finally {
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow-md flex flex-col md:flex-row gap-10 relative">
      {/* Edit Form */}
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

          {/* College Name (Disabled) */}
          <input
            name="collegeName"
            value={formData.collegeName}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            placeholder="College Name"
          />

          {/* Mobile Number (Enabled) */}
         <input
  name="mobileNumber"
  value={formData.mobileNumber}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only digits, max 10, starting with 6-9
    if (/^[6-9]\d{0,9}$/.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, mobileNumber: value }));
    }
  }}
  className="w-full border rounded px-3 py-2"
  placeholder="Mobile Number"
  type="tel"
  maxLength={10}
  pattern="[6-9][0-9]{9}"
  required
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Live Preview or Shimmer */}
      <div className="w-full md:w-1/2 bg-gray-50 p-5 rounded-lg shadow min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center text-center animate-pulse">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-[length:300%_100%] bg-clip-text text-transparent animate-shimmer tracking-wide mb-2">
              Aarambh38
            </h1>
            <p className="text-gray-500 text-base">Stay motivated and please wait...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Live Preview</h3>
            <img
              src={formData.photourl || "https://via.placeholder.com/100"}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border mb-4 cursor-pointer hover:scale-105 transition"
              onClick={() => setIsImageModalOpen(true)}
            />
            <p className="text-lg font-bold">{formData.fullName || "Full Name"}</p>
            <p className="text-xs text-gray-400 mt-2">{formData.emailId || "Email Address"}</p>
            <p className="text-sm text-gray-500">{formData.mobileNumber || "Mobile Number"}</p>
            <p className="text-sm text-gray-500">{formData.age || "Age"}</p>
            <p className="text-sm text-gray-500 mt-3 px-4">{formData.gender || "Gender"}</p>
            <p className="text-sm text-gray-400 mt-1">{formData.collegeName || "College"}</p>
          </div>
        )}
      </div>

      {/* Enlarged Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <img
            src={formData.photourl}
            alt="Full View"
            className="max-w-full max-h-[90vh] rounded-lg shadow-lg border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Toast Message */}
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

export default EditProfileAdmin;
