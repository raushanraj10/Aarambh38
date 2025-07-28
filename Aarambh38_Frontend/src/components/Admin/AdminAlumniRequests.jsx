import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/AllUrl";
import { CheckCircle, XCircle } from "lucide-react";

const AdminAlumniRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getalumnirequests`, {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleAction = async (id, action) => {
    const confirmMsg = `Are you sure you want to ${action} this alumni?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.post(
        `${BASE_URL}/alumnirequest/${id}/${action}`, // Example: /alumnirequest/123/approve
        {},
        { withCredentials: true }
      );
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Alumni Join Requests
        </h1>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No pending requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((alum) => (
              <div
                key={alum._id}
                className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  {alum.photourl ? (
                    <img
                      src={alum.photourl}
                      alt={alum.fullName}
                      className="w-16 h-16 rounded-full object-cover shadow"
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
                    onClick={() => handleAction(alum._id, "approve")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(alum._id, "reject")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumniRequests;
