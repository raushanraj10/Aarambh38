import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";
import Shimmer from "./Shimmer";

export default function AlumniBlocked() {
  const [blockedStudents, setBlockedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, studentId: null });
  const Aluminidata = useSelector((store) => store.aluminidata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Aluminidata) {
      navigate("/loginselectorpage");
      return;
    }

    const fetchBlocked = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/alumniblocked`, {
          withCredentials: true,
        });
        setBlockedStudents(res.data);
      } catch (err) {
        console.error("Error fetching blocked students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocked();
  }, [Aluminidata, navigate]);

  const handleConfirmUnblock = async () => {
    const studentId = confirmModal.studentId;
    setConfirmModal({ show: false, studentId: null });

    try {
      await axios.post(
        `${BASE_URL}/alumni/accepted/${studentId}`,
        {},
        { withCredentials: true }
      );

      setBlockedStudents((prev) =>
        prev.filter((req) => req.fromuserId._id !== studentId)
      );
    } catch (err) {
      console.error("Error unblocking student:", err.response?.data || err.message);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-12 text-red-700">
        Blacklisted Students
      </h2>

      {blockedStudents.length === 0 ? (
        <p className="text-center text-gray-500">No blacklisted students found.</p>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          {blockedStudents.map((req) => {
            const user = req.fromuserId;

            return (
              <div
                key={req._id}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-lg transition"
              >
                {/* Profile Picture */}
                <a href={`#img-${req._id}`}>
                  <img
                    src={user.photourl || "https://via.placeholder.com/80"}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-red-500 cursor-pointer hover:scale-105 transition-transform"
                  />
                </a>

                {/* Modal using :target */}
                <a
                  href="#"
                  id={`img-${req._id}`}
                  className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 invisible opacity-0 pointer-events-none transition-all duration-300 target:visible target:opacity-100 target:pointer-events-auto"
                >
                  <div className="relative">
                    <img
                      src={user.photourl || "https://via.placeholder.com/80"}
                      alt="Enlarged"
                      className="max-w-full max-h-screen rounded-xl border-4 border-white"
                    />
                    <a
                      href="#"
                      className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-red-400 transition"
                    >
                      &times;
                    </a>
                  </div>
                </a>

                {/* Info */}
                <div className="flex-1 space-y-2 text-gray-800 text-sm">
                  <p><strong>👤 Name:</strong> {user.fullName}</p>
                  <p><strong>🎓 Batch:</strong> {user.batch}</p>
                  <p><strong>🏫 College:</strong> {user.collegeName}</p>
                  <p><strong>🏬 Branch:</strong> {user.branch || "N/A"}</p>
                  <p><strong>⚧ Gender:</strong> {user.gender || "N/A"}</p>
                  <p><strong>📝 Original Message:</strong> {req.text}</p>

                  {/* Unblock Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => setConfirmModal({ show: true, studentId: user._id })}
                      className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-5 py-2 rounded-lg font-medium shadow hover:shadow-md transition"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Unblock
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unblock this student?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmModal({ show: false, studentId: null })}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnblock}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
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
