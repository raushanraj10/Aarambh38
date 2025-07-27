import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import LoginSelectorPage from "./LoginSelectorPage";
import { BASE_URL } from "./constants/AllUrl";

export default function AlumniProfilePage() {
    const capitalizeEachWord = (str) =>
  str?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";



  const { id } = useParams(); // alumni ID from URL
  const Navigate = useNavigate();

  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const Admindata = useSelector((store) => store.admindata);

  const [alumniList, setAlumniList] = useState([]);
  const [requestStatus, setRequestStatus] = useState({});
  const [acceptedStatus, setAcceptedStatus] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const alumniRes = await axios.get(`${BASE_URL}/getlistalumni`, {
          withCredentials: true,
        });
        setAlumniList(alumniRes.data);

        const sentRes = await axios.get(`${BASE_URL}/finalsendrequestlist`, {
          withCredentials: true,
        });
        const sentObj = {};
        sentRes.data.forEach((id) => (sentObj[id] = true));
        setRequestStatus(sentObj);

        const acceptedRes = await axios.get(`${BASE_URL}/finallistusermessage`, {
          withCredentials: true,
        });
        const acceptedObj = {};
        acceptedRes.data.forEach((id) => (acceptedObj[id] = true));
        setAcceptedStatus(acceptedObj);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, []);

const handleSendRequest = async (alumniId) => {
  if (requestStatus[alumniId]) return;

  const message = messages[alumniId]?.trim();
  if (!message) {
    alert("Please write a message before sending.");
    return;
  }

  try {
    const alumni = alumniList.find((a) => a._id === alumniId);
    const fromuserId = Studentdata._id;
    

    // 1. Send connection request
    await axios.post(
      `${BASE_URL}/sendrequest/${alumniId}`,
      { text: message },
      { withCredentials: true }
    );

    // 2. Send connection email
    await axios.post(
      `${BASE_URL}/sendrequestbymail`,
      {
        alumniId,
        fromuserId,
        message,
      },
      { withCredentials: true }
    );

    setRequestStatus((prev) => ({ ...prev, [alumniId]: true }));
    alert("Request sent and email notification delivered!");
  } catch (err) {
    console.error("Error sending request:", err);
    alert("Failed to send request.");
  }
};


  const handleSendMessage = (alumniId) => {
    Navigate(`/chat/${alumniId}`);
  };

  if (!Studentdata && !Aluminidata && !Admindata) return <LoginSelectorPage />;

  const alumni = alumniList.find((a) => a._id === id);
  if (!alumni) return <div className="text-center mt-20 text-xl">Loading...</div>;

  const isRequestSent = requestStatus[alumni._id];
  const isAccepted = acceptedStatus[alumni._id];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-green-100 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 border">
        <div className="flex flex-col items-center gap-4">
          <img
            src={alumni.photourl}
            alt="alumni"
            className="w-28 h-28 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
          <h2 className="text-2xl font-bold text-blue-700">{alumni.fullName}</h2>
          <div className="mt-6 w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-5 text-center space-y-2">
  {/* Company Name Highlighted */}
  <div className="text-2xl font-extrabold text-green-700 tracking-wide uppercase">
    {capitalizeEachWord(alumni.company)}
  </div>

  {/* Role Description */}
  <p className="text-base text-gray-700 font-medium">
    {capitalizeEachWord(alumni.role)}{" "}
    <span className="text-gray-500">at</span>{" "}
    <span className="font-semibold text-gray-800">{capitalizeEachWord(alumni.company)}</span>
  </p>
</div>



        </div>

        <div className="mt-6 space-y-2 text-gray-800 text-sm">
          <p><strong>🎓 College:</strong> {alumni.collegeName}</p>
          <p><strong>📅 Batch:</strong> {alumni.batch}</p>
           <p><strong>📅 Branch:</strong> {alumni.branch}</p>
          <p><strong>⚧ Gender:</strong> {alumni.gender}</p>
          <div className="mt-6 bg-gray-50 border-l-4 border-blue-400 p-4 rounded-md shadow-sm">
  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
    <span>📄</span> About Alumni
  </h3>
  <p className="text-gray-700 mt-2 text-sm leading-relaxed">
    {alumni.about ? (
      <span className="italic text-gray-800">"{alumni.about}"</span>
    ) : (
      <span className="text-gray-500 italic">This alumni hasn't shared an about section yet.</span>
    )}
  </p>
</div>

        </div>

        {!isRequestSent && !isAccepted && (
          <textarea
            rows={4}
            value={messages[alumni._id] || ""}
            onChange={(e) =>
              setMessages((prev) => ({ ...prev, [alumni._id]: e.target.value }))
            }
            placeholder="Write a message for the alumni..."
            className="w-full mt-6 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        )}

        <div className="flex justify-center gap-6 mt-6">
          {!isAccepted && (
            <button
              onClick={() => handleSendRequest(alumni._id)}
              disabled={isRequestSent}
              className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                isRequestSent
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRequestSent ? "Request Sent" : "Send Request"}
            </button>
          )}

          <button
            onClick={() => handleSendMessage(alumni._id)}
            disabled={!isAccepted}
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${
              isAccepted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Go to Chat
          </button>
        </div>
      </div>
    </div>
  );
}
