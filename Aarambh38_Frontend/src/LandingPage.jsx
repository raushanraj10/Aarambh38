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
    const fetchData = async () => {
      try {
        const alumniRes = await axios.get("http://localhost:5000/getlistalumni", {
          withCredentials: true,
        });
        setAlumniList(alumniRes.data);

        const sentRes = await axios.get("http://localhost:5000/finalsendrequestlist", {
          withCredentials: true,
        });
        const sentObj = {};
        sentRes.data.forEach((id) => (sentObj[id] = true));
        setRequestStatus(sentObj);

        const acceptedRes = await axios.get("http://localhost:5000/finallistusermessage", {
          withCredentials: true,
        });
        const acceptedObj = {};
        acceptedRes.data.forEach((id) => (acceptedObj[id] = true));
        setAcceptedStatus(acceptedObj);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSendRequest = async (alumniId) => {
    if (requestStatus[alumniId]) return;

    const message = messages[alumniId]?.trim();
    if (!message) {
      alert("Please write a message before sending.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/sendrequest/${alumniId}`,
        { text: message },
        { withCredentials: true }
      );
      setRequestStatus((prev) => ({ ...prev, [alumniId]: true }));
      alert("Request sent!");
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to send request.");
    }
  };

  const handleSendMessage = (alumniId) => {
    alert(`Messaging alumni ID ${alumniId}: ${messages[alumniId]}`);
  };

  // ✅ Filter includes fullName, role, company, collegeName, batch, about
  const filteredAlumni = alumniList.filter((alumni) =>
    `${alumni.fullName} ${alumni.role} ${alumni.company} ${alumni.collegeName} ${alumni.batch} ${alumni.about}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!Studentdata && !Aluminidata && !Admindata) return <LoginSelectorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      {/* Search */}
      <div className="max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by name, role, company, college, batch, or about..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Alumni Cards */}
      <div className="flex flex-col gap-8 items-center">
        {filteredAlumni.map((alumni) => {
          const isRequestSent = requestStatus[alumni._id];
          const isAccepted = acceptedStatus[alumni._id];

          return (
            <div
              key={alumni._id}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-md border p-6 flex flex-col sm:flex-row gap-6"
            >
              {/* Profile Image */}
              <div className="shrink-0">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
                  alt="alumni"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-blue-500"
                />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-1 text-sm text-gray-800">
                <p><span className="font-semibold">👤 Name:</span> {alumni.fullName}</p>
                <p><span className="font-semibold">🧑‍💼 Role:</span> {alumni.role}</p>
                <p><span className="font-semibold">🏢 Company:</span> {alumni.company}</p>
                <p><span className="font-semibold">🎓 Batch:</span> {alumni.batch}</p>
                <p><span className="font-semibold">🏫 College:</span> {alumni.collegeName}</p>
                <p><span className="font-semibold">⚧ Gender:</span> {alumni.gender}</p>
                <p><span className="font-semibold">📄 About:</span> {alumni.about || "N/A"}</p>

                {!isRequestSent && !isAccepted && (
                  <textarea
                    rows={3}
                    placeholder="Write your message..."
                    value={messages[alumni._id] || ""}
                    onChange={(e) =>
                      setMessages((prev) => ({
                        ...prev,
                        [alumni._id]: e.target.value,
                      }))
                    }
                    className="w-full mt-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                )}

                <div className="flex flex-wrap gap-4 pt-3">
                  {!isAccepted && (
                    <button
                      onClick={() => handleSendRequest(alumni._id)}
                      disabled={isRequestSent}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        isRequestSent
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isRequestSent ? "Request Sent" : "Send Request"}
                    </button>
                  )}
                  <button
                    onClick={() => handleSendMessage(alumni._id)}
                    disabled={!isAccepted}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      isAccepted
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-20">
        <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-transparent">
          Empowered by{" "}
          <span className="underline font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Aarambh38
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Connecting students with alumni mentors, one conversation at a time.
        </p>
      </div>
    </div>
  );
}
