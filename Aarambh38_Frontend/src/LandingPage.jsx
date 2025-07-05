import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoginSelectorPage from "./LoginSelectorPage";
import axios from "axios";

export default function StudentLandingPage() {
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const Admindata = useSelector((store) => store.admindata);

  const [alumniList, setAlumniList] = useState([]);
  const [requestStatus, setRequestStatus] = useState({});
  const [acceptedStatus, setAcceptedStatus] = useState({});
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getlistalumni", {
          withCredentials: true,
        });
        setAlumniList(res.data);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };

    fetchAlumni();
  }, []);

  const handleSendRequest = (alumniId) => {
    if (requestStatus[alumniId]) return;

    const message = messages[alumniId]?.trim();
    if (!message) {
      alert("Please write a message before sending.");
      return;
    }

    setRequestStatus((prev) => ({ ...prev, [alumniId]: true }));

    setTimeout(() => {
      setAcceptedStatus((prev) => ({ ...prev, [alumniId]: true }));
    }, 2000);

    alert("Request sent!");
  };

  const handleSendMessage = (alumniId) => {
    alert(`Messaging alumni ID ${alumniId}: ${messages[alumniId]}`);
  };

  const filteredAlumni = alumniList.filter((alumni) =>
    `${alumni.fullName} ${alumni.batch} ${alumni.role} ${alumni.collegeName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!Studentdata && !Aluminidata&& !Admindata) return <LoginSelectorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search alumni by name, batch, role, or college..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Alumni Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {filteredAlumni.length === 0 ? (
          <p className="text-center text-gray-500 col-span-2">No alumni found.</p>
        ) : (
          filteredAlumni.map((alumni) => (
            <div
              key={alumni._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src= "https://cdn-icons-png.freepik.com/512/2558/2558480.png"
                  alt={alumni.fullName}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{alumni.fullName}</h2>
                  <p className="text-sm text-gray-600 italic">{alumni.role} @ {alumni.company}</p>
                  <p className="text-sm text-gray-500">Batch of {alumni.batch}</p>
                </div>
              </div>

              {/* Info */}
              <div className="text-sm space-y-1 mb-3">
                <p><strong>Gender:</strong> {alumni.gender}</p>
                <p><strong>College:</strong> {alumni.collegeName}</p>
              </div>

              {/* About */}
              <p className="text-gray-700 text-sm mb-4 italic">{alumni.about}I am alumni</p>

              {/* Message Input */}
              {!requestStatus[alumni._id] && (
                <textarea
                  rows={3}
                  placeholder="Write your message to alumni..."
                  value={messages[alumni._id] || ""}
                  onChange={(e) =>
                    setMessages((prev) => ({
                      ...prev,
                      [alumni._id]: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-3"
                />
              )}

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  disabled={requestStatus[alumni._id]}
                  onClick={() => handleSendRequest(alumni._id)}
                  className={`${
                    requestStatus[alumni._id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 py-2 rounded-lg transition`}
                >
                  {requestStatus[alumni._id] ? "Request Sent" : "Send Request"}
                </button>

                <button
                  disabled={!acceptedStatus[alumni._id]}
                  onClick={() => handleSendMessage(alumni._id)}
                  className={`${
                    acceptedStatus[alumni._id]
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white px-4 py-2 rounded-lg transition`}
                >
                  Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Aarambh38 Footer Branding */}
      <div className="text-center mt-20">
        <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 tracking-tightfont-extrabold text-transparent tracking-tight">
          Empowered by <span className="underline font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Aarambh38</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Connecting students with alumni mentors, one conversation at a time.
        </p>
      </div>
    </div>
  );
}
