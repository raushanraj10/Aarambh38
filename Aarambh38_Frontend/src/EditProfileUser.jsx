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

  useEffect(() => {
    //  if (Object.keys(studentData).length === 0) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, age, gender, photourl,branch } = formData;

    try {
      const res = await axios.patch(
  `${BASE_URL}/edituser`,
  { fullName, age, gender, photourl, branch },
  { withCredentials: true }
);

      setMessage("✅ Profile updated successfully.");
      setMessageType("success");
      dispatch(addstudent(res.data));
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
            // onChange={handleChange}
            disabled
            className="w-full border rounded px-3 py-2"
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
          <p className="text-sm text-gray-500">{formData.age || "Your Age"}</p>
          <p className="text-sm text-gray-600 mt-1">{formData.collegeName || "College Name"}</p>
          <p className="text-sm text-gray-500 mt-3 px-4">{formData.gender || "Short Bio..."}</p>
          <p className="text-xs text-gray-400 mt-2">{formData.emailId || "Email Address"}</p>
        </div>
      </div>

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

export default EditProfileUser;
