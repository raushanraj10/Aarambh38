import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoginSelectorPage from "./LoginSelectorPage";

export default function AlumniMentees() {
  const alumniData = useSelector((store) => store.aluminidata);
  const [mentees, setMentees] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getalumnimentees", {
          withCredentials: true,
        });
        setMentees(res.data);

        const unreadRes = await axios.get("http://localhost:5000/unreadmessages", {
          withCredentials: true,
        });
        // Format: { studentId1: true, studentId2: false, ... }
        setUnreadMap(unreadRes.data || {});
      } catch (err) {
        console.error("Failed to fetch mentees or unread messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  const handleMessageClick = (studentId) => {
    alert(`Open chat with student: ${studentId}`);
    // Optional: mark messages as read after clicking
  };

  if (!alumniData) return <LoginSelectorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-8">Your Mentees</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : mentees.length === 0 ? (
        <p className="text-center text-gray-500">No mentees found.</p>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          {mentees.map((student) => {
            const hasUnread = unreadMap[student._id];

            return (
              <div
                key={student._id}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-md border p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Profile Image */}
                <div className="shrink-0">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="student"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-green-500"
                  />
                </div>

                {/* Student Info */}
                <div className="flex-1 space-y-1 text-sm text-gray-800">
                  <p><strong>👤 Name:</strong> {student.fullName}</p>
                  <p><strong>🎓 College:</strong> {student.collegeName}</p>
                  <p><strong>📚 Branch:</strong> {student.branch}</p>
                  <p><strong>🎓 Batch:</strong> {student.batch}</p>
                  <p><strong>📄 About:</strong> {student.about || "N/A"}</p>

                  <div className="pt-3 flex items-center gap-3">
                    <button
                      onClick={() => handleMessageClick(student._id)}
                      className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Message
                    </button>

                    {hasUnread && (
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" title="New message"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-20">
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

// for indicator
// {
//   "64adf1a2b3...": true,
//   "64ef123a32...": false
// }
