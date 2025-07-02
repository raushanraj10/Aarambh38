import { useState } from "react";

const alumniList = [
  {
    id: 1,
    name: "Riya Sharma",
    batch: "2018",
    field: "Software Engineer at Google",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Aman Verma",
    batch: "2017",
    field: "Data Scientist at Microsoft",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 3,
    name: "Megha Patel",
    batch: "2019",
    field: "Product Manager at Amazon",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 4,
    name: "Sunder Pichai",
    batch: "2017",
    field: "Google CEO",
    image: "data:image/jpeg;base64,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",
  },
];

export default function StudentLandingPage() {
  const [message, setMessage] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [requestStatus, setRequestStatus] = useState({});
  const [acceptedStatus, setAcceptedStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendRequest = (alumniId) => {
    if (requestStatus[alumniId]) return;

    if (!message.trim()) {
      alert("Please write a message before sending.");
      return;
    }

    // Simulate sending request
    setRequestStatus({ ...requestStatus, [alumniId]: true });

    // Simulate that alumni accepts after a while (replace this with real status from DB)
    setTimeout(() => {
      setAcceptedStatus((prev) => ({ ...prev, [alumniId]: true }));
    }, 3000);

    setMessage("");
    alert("Request sent!");
  };

  const handleSendMessage = (alumniId) => {
    alert(`Messaging alumni ID ${alumniId}`);
  };

  const filteredAlumni = alumniList.filter((alumni) =>
    `${alumni.name} ${alumni.batch} ${alumni.field}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-6">
        Connect with Alumni
      </h1>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search alumni by name, batch, or field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Alumni Cards */}
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
                </div>
              </div>

              {/* Message Input (if request not sent yet) */}
              {!requestStatus[alumni.id] && (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4"
                  rows={3}
                  placeholder="Write your message to alumni..."
                  value={selectedAlumni === alumni.id ? message : ""}
                  onFocus={() => setSelectedAlumni(alumni.id)}
                  onChange={(e) => setMessage(e.target.value)}
                />
              )}

              {/* Buttons */}
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
