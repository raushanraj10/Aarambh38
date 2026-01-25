import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/AllUrl";
import { CheckCircle, XCircle, Search, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../Shimmer";
import moment from "moment";

const AdminStudentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [handlingAction, setHandlingAction] = useState(false);

  // email modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAlum, setEmailAlum] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
// popup notification state
const [popupMessage, setPopupMessage] = useState(null);
const [popupType, setPopupType] = useState("success"); // "success" | "error"

  const admin = useSelector((state) => state.admindata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/loginselectorpage");
    }
  }, [admin]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getallrequestedstudent`, {
        withCredentials: true,
      });

      const sameCollege = res.data.filter(
        (alum) =>
          alum.collegeName?.toLowerCase() === admin?.collegeName?.toLowerCase()
      );

      setRequests(sameCollege);
    } catch (err) {
      console.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (alumni, type) => {
    setSelectedAlumni(alumni);
    setActionType(type);
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAlumni || !actionType) return;

    setHandlingAction(true);
    try {
      await axios.post(
        `${BASE_URL}/studentrequest/${selectedAlumni._id}/${actionType}`,
        {},
        { withCredentials: true }
      );
      setIsActionModalOpen(false);
      setSelectedAlumni(null);
      setActionType(null);
      fetchRequests();
    } catch (err) {
      console.error("Action failed");
    } finally {
      setHandlingAction(false);
    }
  };

  // ✅ open email modal instead of sending directly
  const openEmailModal = (alum) => {
    setEmailAlum(alum);
    setEmailSubject(`Hello ${alum.fullName}`);
    setEmailMessage("");
    setIsEmailModalOpen(true);
  };

 const handleConfirmSendEmail = async () => {
  if (!emailAlum) return;

  if (!emailSubject || !emailMessage) {
    setPopupType("error");
    setPopupMessage("Please fill subject and message ❌");
    return;
  }

  setSendingEmail(true);
  try {
    await axios.post(
      `${BASE_URL}/sendemailtouser`,
      {
        to: emailAlum.emailId,
        fullName: emailAlum.fullName,
        subject: emailSubject,
        message: emailMessage,
      },
      { withCredentials: true }
    );

    setPopupType("success");
    setPopupMessage("Email sent successfully ✅");

    setIsEmailModalOpen(false);
    setEmailAlum(null);
    setEmailSubject("");
    setEmailMessage("");
  } catch (err) {
    console.error("Failed to send email");
    setPopupType("error");
    setPopupMessage("Failed to send email ❌");
  } finally {
    setSendingEmail(false);
    // auto-close popup after 3 seconds
    setTimeout(() => setPopupMessage(null), 3000);
  }
};


  const filteredRequests = requests.filter((alum) => {
    const searchLower = search.toLowerCase();

    return (
      (alum.fullName && alum.fullName.toLowerCase().includes(searchLower)) ||
      (alum.emailId && alum.emailId.toLowerCase().includes(searchLower)) ||
      (alum.collegeName &&
        alum.collegeName.toLowerCase().includes(searchLower)) ||
      (alum.registration &&
        alum.registration.toString().toLowerCase().includes(searchLower))
    );
  });

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="relative text-center mb-10">
  <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 relative inline-block px-6 py-2">
    {admin?.collegeName}
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></span>
  </h2>
</div>

        <h1 className="text-3xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Student Join Requests
        </h1>

        {/* Search box */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, registration no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500">No requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((alum) => (
              <div
                key={alum._id}
                className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    {alum.photourl ? (
                      <img
                        src={alum.photourl}
                        alt={alum.fullName}
                        className="w-16 h-16 rounded-full object-cover shadow cursor-pointer hover:scale-105 transition"
                        onClick={() => setSelectedImage(alum.photourl)}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow">
                        {alum.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold">{alum.fullName}</h2>
                      <p className="text-sm text-gray-500">{alum.emailId}</p>
                      {/* <p className="text-sm text-gray-500">
                        {alum.role} @ {alum.company}
                      </p> */}
                      {alum.gate === "Qualified" && (
                        <p className="text-xs font-medium text-green-600">
                          🎯 GATE Qualified
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 text-center sm:text-left">
  <strong>Requested On:</strong>{" "}
  {moment(alum.createdAt).format("DD MMM YYYY, h:mm A")}
</p>

                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Gender:</strong> {alum.gender}</p>
                  <p><strong>College:</strong> {alum.collegeName}</p>
                  <p><strong>Branch:</strong> {alum.branch}</p>
                  <p><strong>Batch:</strong> {alum.batch}</p>
                  <p><strong>Age:</strong> {alum.age}</p>
                  <p><strong>Mobile:</strong> {alum.mobileNumber||"NA"}</p>
                  <p><strong>About:</strong> {alum.about||"NA"}</p>
                  <p><strong>Registration No.:</strong> {alum.registration}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => openActionModal(alum, "Approved")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => openActionModal(alum, "Reject")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                  <button
                    onClick={() => openEmailModal(alum)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                  >
                    <Mail size={18} />
                    Send Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Alumni"
              className="max-w-full max-h-[90vh] rounded-xl border-4 border-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Confirm Action Modal */}
        {isActionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-800">
                Confirm {actionType}
              </h2>
              <p>
                Are you sure you want to <strong>{actionType}</strong> alumni{" "}
                <strong>{selectedAlumni?.fullName}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={handlingAction}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={handlingAction}
                >
                  {handlingAction ? "Processing..." : "Yes, Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {isEmailModalOpen && emailAlum && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Send Email</h2>

              <div>
                <label className="block text-sm font-medium">To:</label>
                <input
                  type="email"
                  value={emailAlum.emailId}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Subject:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Message:</label>
                <textarea
                  rows="4"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSendEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? "Sending..." : "Confirm Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Popup Message */}
{popupMessage && (
  <div className="fixed inset-0 flex items-center justify-center z-[100]">
    <div
      className={`popup-enter flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white text-lg font-semibold backdrop-blur-md ${
        popupType === "success"
          ? "bg-gradient-to-r from-green-500/90 to-green-600/90"
          : "bg-gradient-to-r from-red-500/90 to-red-600/90"
      }`}
    >
      {/* Icon */}
      {popupType === "success" ? (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="tracking-wide">{popupMessage}</span>
    </div>
  </div>
)}


    </div>
  );
};

export default AdminStudentRequests;