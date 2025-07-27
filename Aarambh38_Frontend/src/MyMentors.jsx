import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoginSelectorPage from "./LoginSelectorPage";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";

export default function MyMentors() {
  const Studentdata = useSelector((store) => store.studentdata);
  const [mentors, setMentors] = useState([]);
  const Navigate=useNavigate()

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/mymentors`, {
  withCredentials: true,
});

        // console.log(res)
        setMentors(res.data);
      } catch (error) {
        console.error("Failed to load mentors", error);
      }
    };

    fetchMentors();
  }, []);

 const handlemessage = (touserId) => {
  Navigate(`/chat/${touserId}`);
};

  if (!Studentdata) return <LoginSelectorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-10">My Mentors</h1>

      {mentors.length === 0 ? (
        <p className="text-center text-gray-500">No mentors assigned yet.</p>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-md border p-6 flex flex-col sm:flex-row gap-6"
            >
              {/* Profile Image */}
              <img
                src={mentor.photourl || "https://cdn-icons-png.flaticon.com/512/194/194938.png"}
                alt="mentor"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />

              {/* Mentor Info */}
              <div className="flex-1 space-y-1 text-sm text-gray-800">
                <p><strong>👤 Name:</strong> {mentor.fullName}</p>
                <p><strong>🏢 Company:</strong> {mentor.company}</p>
                <p><strong>💼 Role:</strong> {mentor.role}</p>
                <p><strong>🎓 Batch:</strong> {mentor.batch}</p>
                <p><strong>🏫 College:</strong> {mentor.collegeName}</p>
                <p><strong>🏫 Branch:</strong> {mentor.branch}</p>
                <p><strong>⚧ Gender:</strong> {mentor.gender}</p>
                <p><strong>📄 About:</strong> {mentor.about || "N/A"}</p>
              </div>

              {/* Message Button */}
              <div className="flex items-start sm:items-center">
                <button
                  onClick={() => handlemessage(mentor._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  Go To Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
