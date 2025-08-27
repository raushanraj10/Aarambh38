import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Trash2, Mail, X } from "lucide-react";
import { BASE_URL } from "../../constants/AllUrl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../Shimmer";
import moment from "moment";

const AdminAlumniList = () => {
  const [alumni, setAlumni] = useState([]);
  const [confirmSendModal, setConfirmSendModal] = useState(false);
const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [emailData, setEmailData] = useState({ to: "", subject: "", message: "" });
  const [imageModalUrl, setImageModalUrl] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ added

  const admin = useSelector((state) => state.admindata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) navigate("/loginselectorpage");
  }, [admin]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true); // ✅ start loading
    try {
      const res = await axios.get(`${BASE_URL}/getallalumni`, { withCredentials: true });
      setAlumni(res.data);
    } catch (err) {
      console.error("Failed to fetch alumni:", err);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const deleteAlumni = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/deletealumni/${id}`, {
      withCredentials: true,
    });
    fetchAlumni();
    setDeleteModal({ show: false, id: null });
  } catch (err) {
    console.error("Delete failed:", err);
  }
};


  const openEmailModal = (email) => {
    setEmailData({ to: email, subject: "", message: "" });
    setShowModal(true);
  };

  const sendEmail = async () => {
    try {
      await axios.post(`${BASE_URL}/sendemailtouser`, emailData, { withCredentials: true });
      alert("Email sent successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Email send failed:", err);
      alert("Failed to send email.");
    }
  };

  const filteredAlumni = alumni.filter((a) =>
    a.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Correct shimmer loading logic
  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 text-center mb-6">
          Alumni Management Panel
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="bg-white shadow rounded-lg divide-y">
          {filteredAlumni.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No alumni found matching your search.
            </div>
          ) : (
            filteredAlumni.map((alum) => (
              <div key={alum._id} className="py-4 transition-all duration-200 hover:bg-gray-50">
                <div
                  onClick={() => toggleExpand(alum._id)}
                  className="flex items-center justify-between px-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {alum.photourl ? (
                      <img
                        src={alum.photourl}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageModalUrl(alum.photourl);
                        }}
                        className="w-12 h-12 rounded-full object-cover shadow cursor-zoom-in"
                        alt={alum.fullName}
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
  {alum.company} • {alum.role}
  {alum.gate === "Qualified" && " • 🎯 GATE Qualified"}
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
    <div className="flex justify-between items-center">
      <div>
        <p><strong>Gender:</strong> {alum.gender}</p>
        <p><strong>College:</strong> {alum.collegeName}</p>
        <p><strong>Branch:</strong> {alum.branch}</p>
        <p><strong>Batch:</strong> {alum.batch}</p>
        <p><strong>Age:</strong> {alum.age}</p>
        <p><strong>Mobile:</strong> {alum.mobileNumber}</p>
        <p><strong>About:</strong> {alum.about}</p>
        <p><strong>Registration Number:</strong> {alum.registration}</p>
      </div>

      {/* Added on - right side */}
      <p className="text-xs text-gray-400 text-right">
        <strong>Added On:</strong> {moment(alum.createdAt).format("DD MMM YYYY, h:mm A")}
          </p>
      
    </div>

    <div className="flex gap-4 pt-4">
      <button
        onClick={() => setDeleteModal({ show: true, id: alum._id })}
        className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
      >
        <Trash2 size={16} /> Delete Alumni
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

      {/* Email Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
              Send Email to Alumni
            </h2>
            <p className="text-sm mb-4 text-gray-500 text-center">
              <strong>To:</strong> {emailData.to}
            </p>
            <input
              type="text"
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Write your message here..."
              rows="6"
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
<button
  onClick={() => setConfirmSendModal(true)}
  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
>
  Send Email
</button>

          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModalUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImageModalUrl(null)}
        >
          <div className="relative">
            <img
              src={imageModalUrl}
              alt="Full Size"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg border-4 border-white"
            />
            <button
              className="absolute top-0 right-0 text-white text-2xl bg-black bg-opacity-50 px-3 py-1 rounded-bl-lg hover:bg-opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                setImageModalUrl(null);
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
      {/* Confirm Send Modal */}
{confirmSendModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
        Confirm Send
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Are you sure you want to send this email to <strong>{emailData.to}</strong>?
      </p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setConfirmSendModal(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            sendEmail();
            setConfirmSendModal(false);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}
{/* Delete Confirmation Modal */}
{deleteModal.show && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
        Confirm Delete
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Are you sure you want to delete this alumni? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setDeleteModal({ show: false, id: null })}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteAlumni(deleteModal.id)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminAlumniList;
