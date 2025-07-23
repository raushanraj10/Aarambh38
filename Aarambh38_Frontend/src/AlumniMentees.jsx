import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoginSelectorPage from "./LoginSelectorPage";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";

export default function AlumniMentees() {
  const navigate = useNavigate(); // ✅ fixed: lowercase
  const alumniData = useSelector((store) => store.aluminidata);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/getalumnimentees`, {
  withCredentials: true,
});

        setMentees(res.data);
      } catch (err) {
        console.error("Failed to fetch mentees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  const handleMessageClick = (studentId) => {
    navigate(`/chat/${studentId}`); // ✅ dynamic routing with ID
  };

  if (!alumniData) return <LoginSelectorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-700">Your Mentees</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : mentees.length === 0 ? (
        <p className="text-center text-gray-500">No mentees found.</p>
      ) : (
        <div className="flex flex-col gap-10 items-center">
          {mentees.map((student) => (
            <div
              key={student._id}
              className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 transition-shadow hover:shadow-xl"
            >
              {/* Profile Image */}
              <img
                src={student.photourl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="student"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />

              {/* Student Info */}
              <div className="flex-1 text-gray-800 text-base space-y-2">
                <p><strong>👤 Name:</strong> {student.fullName}</p>
                <p><strong>🎓 College:</strong> {student.collegeName}</p>
                <p><strong>📚 Branch:</strong> {student.branch}</p>
                <p><strong>🎓 Batch:</strong> {student.batch}</p>
                <p><strong>📄 About:</strong> {student.about || "N/A"}</p>

                <div className="pt-4">
                  <button
                    onClick={() => handleMessageClick(student._id)}
                    className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium px-6 py-2 rounded-xl shadow hover:shadow-md transition"
                  >
                    Go To Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
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
