import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AlumniReceivedRequest() {
  const [requests, setRequests] = useState([]);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in as alumni
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
    try {
      await axios.post(
        `http://localhost:5000/alumni/handle-request/${studentId}`,
        { action },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((req) => req._id !== studentId));
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Incoming Student Requests
      </h2>

      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No pending requests.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-6 rounded-xl shadow flex flex-col gap-2 border"
            >
              <p><strong>👤 Name:</strong> {req.fullName}</p>
              <p><strong>🎓 Batch:</strong> {req.batch}</p>
              <p><strong>🏫 College:</strong> {req.collegeName}</p>
              <p><strong>💬 Message:</strong> {req.message}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAction(req._id, "accept")}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(req._id, "block")}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
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
