import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Trash2, Mail, X } from "lucide-react";
import { BASE_URL } from "../../constants/AllUrl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../Shimmer";

const StudentList = () => {
  const [alumni, setAlumni] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const admin = useSelector((state) => state.admindata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/loginselectorpage");
    }
  }, [admin]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/getallstudent`, {
      withCredentials: true,
    });
    setAlumni(res.data);
  } catch (err) {
    console.error("Failed to fetch student:", err);
  } finally {
    setLoading(false);
  }
};


  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const deleteAlumni = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${BASE_URL}/deletestudent/${id}`, {
          withCredentials: true,
        });
        fetchAlumni();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const openEmailModal = (email) => {
    setSelectedEmail(email);
    setEmailSubject("Aarambh38 Student Message");
    setEmailMessage("");
    setIsModalOpen(true);
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(
        `${BASE_URL}/sendemailtouser`,
        {
          to: selectedEmail,
          subject: emailSubject,
          message: emailMessage,
        },
        { withCredentials: true }
      );
      alert("Email sent successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Failed to send email.");
    }
  };

  const filteredAlumni = alumni.filter((a) =>
    a.fullName.toLowerCase().includes(search.toLowerCase())
  );
 if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 text-center mb-6">
          Student Management Panel
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="bg-white shadow rounded-lg divide-y">
          {filteredAlumni.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No students found matching your search.
            </div>
          ) : (
            filteredAlumni.map((alum) => (
              <div
                key={alum._id}
                className="py-4 transition-all duration-200 hover:bg-gray-50"
              >
                <div
                  onClick={() => toggleExpand(alum._id)}
                  className="flex items-center justify-between px-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {alum.photourl ? (
                      <img
                        src={alum.photourl}
                        className="w-12 h-12 rounded-full object-cover shadow cursor-pointer"
                        alt={alum.fullName}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(alum.photourl);
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow">
                        {alum.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">{alum.fullName}</p>
                      <p className="text-sm text-gray-500">{alum.emailId}</p>
                      <p className="text-sm text-gray-600">
                        {alum.collegeName}
                      </p>
                    </div>
                  </div>
                  {expandedId === alum._id ? (
                    <ChevronUp className="text-gray-500" />
                  ) : (
                    <ChevronDown className="text-gray-500" />
                  )}
                </div>

                {expandedId === alum._id && (
                  <div className="bg-gray-50 px-6 mt-4 text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>Gender:</strong> {alum.gender}
                    </p>
                    <p>
                      <strong>College:</strong> {alum.collegeName}
                    </p>
                    <p>
                      <strong>Branch:</strong> {alum.branch}
                    </p>
                    <p>
                      <strong>Batch:</strong> {alum.batch}
                    </p>
                    <p>
                      <strong>Age:</strong> {alum.age}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {alum.mobileNumber}
                    </p>
                    <p>
                      <strong>Registration Number:</strong> {alum.registration}
                    </p>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => deleteAlumni(alum._id)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                      >
                        <Trash2 size={16} /> Delete Student
                      </button>
                      <button
                        onClick={() => openEmailModal(alum.emailId)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        <Mail size={16} /> Send Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📩 Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Send Email</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium">To</label>
              <input
                type="email"
                value={selectedEmail}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />

              <label className="block text-sm font-medium">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />

              <label className="block text-sm font-medium">Message</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32 resize-none"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1 m-2 hover:bg-opacity-75"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
