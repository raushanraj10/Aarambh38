import { useState } from "react";
import { useSelector } from "react-redux";
import LoginSelectorPage from "./LoginSelectorPage";

const alumniList = [
  {
    id: 1,
    name: "Riya Sharma",
    batch: "2018",
    field: "Software Engineer at Google",
    college: "IIT Delhi",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Aman Verma",
    batch: "2017",
    field: "Data Scientist at Microsoft",
    college: "BITS Pilani",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 3,
    name: "Megha Patel",
    batch: "2019",
    field: "Product Manager at Amazon",
    college: "NIT Trichy",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 4,
    name: "Sunder Pichai",
    batch: "2017",
    field: "Google CEO",
    college: "IIT Kharagpur",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

export default function StudentLandingPage() {
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);

  const [requestStatus, setRequestStatus] = useState({});
  const [acceptedStatus, setAcceptedStatus] = useState({});
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendRequest = (alumniId) => {
    if (requestStatus[alumniId]) return;

    const message = messages[alumniId]?.trim();
    if (!message) {
      alert("Please write a message before sending.");
      return;
    }

    setRequestStatus((prev) => ({ ...prev, [alumniId]: true }));

    // Simulate acceptance after delay
    setTimeout(() => {
      setAcceptedStatus((prev) => ({ ...prev, [alumniId]: true }));
    }, 2000);

    alert("Request sent!");
  };

  const handleSendMessage = (alumniId) => {
    alert(`Messaging alumni ID ${alumniId}: ${messages[alumniId]}`);
  };

  const filteredAlumni = alumniList.filter((alumni) =>
    `${alumni.name} ${alumni.batch} ${alumni.field} ${alumni.college}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!Studentdata && !Aluminidata) return <LoginSelectorPage />;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-6">
        Connect with Alumni
      </h1>

      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search alumni by name, batch, field, or college..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {filteredAlumni.length === 0 ? (
          <p className="text-center text-gray-500 col-span-2">No alumni found.</p>
        ) : (
          filteredAlumni.map((alumni) => (
            <div
              key={alumni.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={alumni.image}
                  alt={alumni.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {alumni.name}
                  </h2>
                  <p className="text-sm text-gray-500">Batch of {alumni.batch}</p>
                  <p className="text-sm text-gray-600">{alumni.field}</p>
                  <p className="text-sm text-gray-600 italic">{alumni.college}</p>
                </div>
              </div>

              {!requestStatus[alumni.id] && (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4"
                  rows={3}
                  placeholder="Write your message to alumni..."
                  value={messages[alumni.id] || ""}
                  onChange={(e) =>
                    setMessages((prev) => ({
                      ...prev,
                      [alumni.id]: e.target.value,
                    }))
                  }
                />
              )}

              <div className="flex justify-between">
                <button
                  disabled={requestStatus[alumni.id]}
                  onClick={() => handleSendRequest(alumni.id)}
                  className={`${
                    requestStatus[alumni.id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 py-2 rounded-lg transition`}
                >
                  {requestStatus[alumni.id] ? "Request Sent" : "Send Request"}
                </button>

                <button
                  disabled={!acceptedStatus[alumni.id]}
                  onClick={() => handleSendMessage(alumni.id)}
                  className={`${
                    acceptedStatus[alumni.id]
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
    </div>
  );
}
