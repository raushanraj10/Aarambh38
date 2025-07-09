import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Ban } from "lucide-react";

export default function AlumniReceivedRequest() {
  const [requests, setRequests] = useState([]);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Aluminidata) {
      navigate("/loginselectorpage");
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/alumnirecivedrequest", {
          withCredentials: true,
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, [Aluminidata, navigate]);

  const handleAction = async (studentId, action) => {
    const confirmed = window.confirm(`Are you sure you want to ${action} this request?`);
    if (!confirmed) return;

    try {
      await axios.post(
        `http://localhost:5000/alumni/${action}/${studentId}`,
        {},
        { withCredentials: true }
      );

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req.fromuserId._id !== studentId));
    } catch (err) {
      console.error("Error handling request:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Incoming Student Requests
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {requests.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No pending requests.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow-lg rounded-2xl border p-6 md:p-8 flex flex-col gap-4 hover:shadow-xl transition"
            >
              <div className="text-gray-800 space-y-1 text-sm md:text-base">
                <p><strong>👤 Name:</strong> {req.fromuserId.fullName}</p>
                <p><strong>🎓 Batch:</strong> {req.fromuserId.batch}</p>
                <p><strong>🏫 College:</strong> {req.fromuserId.collegeName}</p>
                <p><strong>🏬 Branch:</strong> {req.fromuserId.branch}</p>

                {/* Bigger Message Box */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-gray-700">
                  <p className="font-semibold">💬 Message:</p>
                  <p className="mt-1 whitespace-pre-line">{req.text}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => handleAction(req.fromuserId._id, "accepted")}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  <CheckCircle size={18} />
                  Accept
                </button>
                <button
                  onClick={() => handleAction(req.fromuserId._id, "rejected")}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button
                  onClick={() => handleAction(req.fromuserId._id, "blocked")}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  <Ban size={18} />
                  Block
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
