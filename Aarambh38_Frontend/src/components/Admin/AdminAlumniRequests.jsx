import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/AllUrl";
import { CheckCircle, XCircle, Search, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../Shimmer";
import moment from "moment";

const AdminAlumniRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [handlingAction, setHandlingAction] = useState(false);

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
      const res = await axios.get(`${BASE_URL}/getallrequestedalumni`, {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
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
        `${BASE_URL}/alumnirequest/${selectedAlumni._id}/${actionType}`,
        {},
        { withCredentials: true }
      );
      setIsActionModalOpen(false);
      setSelectedAlumni(null);
      setActionType(null);
      fetchRequests();
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setHandlingAction(false);
    }
  };

  const filteredRequests = requests.filter((alum) =>
    Object.values(alum).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Alumni Join Requests
        </h1>

        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, college, company, etc."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500">No matching requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((alum) => (
  <div
    key={alum._id}
    className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition"
  >
    <div className="flex justify-between items-center mb-4">
      {/* Left: Profile picture & basic info */}
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
          <p className="text-sm text-gray-500">
            {alum.role} @ {alum.company}
          </p>
        </div>
      </div>

      {/* Right: Request date/time */}
      <p className="text-xs text-gray-400 self-center">
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
      <p><strong>Mobile:</strong> {alum.mobileNumber}</p>
      <p><strong>About:</strong> {alum.about}</p>
      <p><strong>Registration No.:</strong> {alum.registration}</p>
    </div>

    <div className="mt-4 flex gap-4">
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
      </div>
    </div>
  );
};

export default AdminAlumniRequests;
