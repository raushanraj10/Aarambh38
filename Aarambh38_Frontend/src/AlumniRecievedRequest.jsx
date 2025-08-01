import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Ban } from "lucide-react";
import { BASE_URL } from "./constants/AllUrl";
import Shimmer from "./Shimmer";

export default function AlumniReceivedRequest() {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const navigate = useNavigate();
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Aluminidata) {
      navigate("/loginselectorpage");
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/alumnirecivedrequest`, {
          withCredentials: true,
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
      finally {
        setLoading(false);}
    };

    fetchRequests();
  }, [Aluminidata, navigate]);

  const handleAction = async (studentId, action) => {
    const confirmed = window.confirm(`Are you sure you want to ${action} this request?`);
    if (!confirmed) return;

    setLoadingId(studentId);

    try {
      await axios.post(
        `${BASE_URL}/alumni/${action}/${studentId}`,
        {},
        { withCredentials: true }
      );

      setRequests((prev) => prev.filter((req) => req.fromuserId._id !== studentId));
    } catch (err) {
      console.error("Error handling request:", err.response?.data || err.message);
    } finally {
      setLoadingId(null);
    }
  };
 if (loading) return <Shimmer />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Incoming Student Requests
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {requests.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No pending requests.</p>
        ) : (
          requests.map((req) => {
            const isLoading = loadingId === req.fromuserId._id;

            return (
              <div
                key={req._id}
                className="relative bg-white shadow-lg rounded-2xl border p-6 md:p-8 flex flex-col gap-4 hover:shadow-xl transition"
              >
                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-10">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}

                {/* Profile & Details */}
                <div className="flex items-start gap-4 text-gray-800 text-sm md:text-base">
                  {/* ✅ Fix typo here */}
                  <img
                    src={req.fromuserId.photourl}
                    alt="Profile"
                    onClick={() => setPreviewImage(req.fromuserId.photourl)}
                    className="w-16 h-16 rounded-full border object-cover cursor-pointer hover:scale-105 transition-transform"
                  />

                  <div className="space-y-1">
                    <p><strong>👤 Name:</strong> {req.fromuserId.fullName}</p>
                    <p><strong>🎓 Batch:</strong> {req.fromuserId.batch}</p>
                    <p><strong>🏫 College:</strong> {req.fromuserId.collegeName}</p>
                    <p><strong>🏬 Branch:</strong> {req.fromuserId.branch}</p>
                    <p><strong>🏫 Age:</strong> {req.fromuserId.age}</p>
                    <p><strong>🏬 Gender:</strong> {req.fromuserId.gender}</p>
                  </div>
                </div>

                {/* Message Box */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-gray-700">
                  <p className="font-semibold">💬 Message:</p>
                  <p className="mt-1 whitespace-pre-line">{req.text}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 z-0">
                  <button
                    onClick={() => handleAction(req.fromuserId._id, "accepted")}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                      isLoading ? "bg-green-300 cursor-wait" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>

                  <button
                    onClick={() => handleAction(req.fromuserId._id, "rejected")}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                      isLoading ? "bg-yellow-300 cursor-wait" : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  <button
                    onClick={() => handleAction(req.fromuserId._id, "blocked")}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                      isLoading ? "bg-red-300 cursor-wait" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    <Ban size={18} />
                    Block
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Enlarged Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Enlarged"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl border-4 border-white shadow-2xl transition"
          />
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-24">
        <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-transparent">
          Empowered by{" "}
          <span className="underline font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Aarambh38
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Guiding students through mentorship, one message at a time.
        </p>
      </div>
    </div>
  );
}
