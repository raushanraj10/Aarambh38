// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import LoginSelectorPage from "./LoginSelectorPage";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { BASE_URL } from "./constants/AllUrl";
// import Shimmer from "./Shimmer";

// export default function StudentLandingPage() {
//   const capitalizeEachWord = (str) =>
//     str?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";

//   const navigate = useNavigate();
//   const Studentdata = useSelector((store) => store.studentdata);
//   const Aluminidata = useSelector((store) => store.aluminidata);
//   const Admindata = useSelector((store) => store.admindata);
//   const [loading, setLoading] = useState(true);

//   const [alumniList, setAlumniList] = useState([]);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
// const [currentAlumniId, setCurrentAlumniId] = useState(null);

//   const [requestStatus, setRequestStatus] = useState({});
//   const [acceptedStatus, setAcceptedStatus] = useState({});
//   const [messages, setMessages] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loadingAlumniId, setLoadingAlumniId] = useState(null);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true); // Start loading

//       const [alumniRes, sentRes, acceptedRes] = await Promise.allSettled([
//         axios.get(`${BASE_URL}/getlistalumni`, { withCredentials: true }),
//         axios.get(`${BASE_URL}/finalsendrequestlist`, { withCredentials: true }),
//         axios.get(`${BASE_URL}/finallistusermessage`, { withCredentials: true }),
//       ]);

//       if (alumniRes.status === "fulfilled") {
//         setAlumniList(alumniRes.value.data);
//       }

//       if (sentRes.status === "fulfilled") {
//         const sentMap = {};
//         sentRes.value.data.forEach((id) => {
//           const stringId = typeof id === "object" ? id._id : id;
//           sentMap[stringId] = true;
//         });
//         setRequestStatus(sentMap);
//       }

//       if (acceptedRes.status === "fulfilled") {
//         const acceptedMap = {};
//         acceptedRes.value.data.forEach((id) => {
//           const stringId = typeof id === "object" ? id._id : id;
//           acceptedMap[stringId] = true;
//         });
//         setAcceptedStatus(acceptedMap);
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   fetchData();
// }, []);



// const confirmSendRequest = (alumniId) => {
//   const message = messages[alumniId]?.trim();
//   if (!message) {
//     alert("Please write a message before sending.");
//     return;
//   }
//   setCurrentAlumniId(alumniId);
//   setShowConfirmModal(true);
// };

// const handleSendRequest = async () => {
//   if (!currentAlumniId) return;
//   setLoadingAlumniId(currentAlumniId);

//   const message = messages[currentAlumniId];

//   try {
//     await axios.post(
//       `${BASE_URL}/sendrequest/${currentAlumniId}`,
//       { text: message },
//       { withCredentials: true }
//     );

//     const fromuserId = Studentdata._id;
//     await axios.post(
//       `${BASE_URL}/sendrequestbymail`,
//       { alumniId: currentAlumniId, fromuserId, message },
//       { withCredentials: true }
//     );

//     setRequestStatus((prev) => ({
//       ...prev,
//       [currentAlumniId]: true,
//     }));
//   } catch (err) {
//     console.error("Error sending request:", err);
//     alert("Failed to send request.");
//   } finally {
//     setLoadingAlumniId(null);
//     setShowConfirmModal(false);
//     setCurrentAlumniId(null);
//   }
// };


//   const handleSendMessage = (alumniId) => {
//     navigate(`/chat/${alumniId}`);
//   };

//   const filteredAlumni = alumniList.filter((alumni) =>
//     `${alumni.fullName} ${alumni.role} ${alumni.company} ${alumni.collegeName} ${alumni.batch} ${alumni.about}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   if (!Studentdata && !Aluminidata && !Admindata) return <LoginSelectorPage />;
//  if(loading) return <Shimmer/>
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
//       <div className="max-w-2xl mx-auto mb-10">
//         <input
//           type="text"
//           placeholder="Search by name, role, company, college, batch, or about..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//         />
//       </div>

//       <div className="flex flex-col gap-8 items-center">
//         {filteredAlumni.length === 0 ? (
//           <div className="text-gray-600 text-center text-lg font-medium mt-10">
//             No alumni found matching your search.
//           </div>
//         ) : (
//           filteredAlumni.map((alumni) => {
//             const id = alumni._id;
//             const isRequestSent = requestStatus[id];
//             const isAccepted = acceptedStatus[id];
//             const isLoading = loadingAlumniId === id;

//             return (Studentdata&&
//               <div
//                 key={id}
//                 className="relative w-full max-w-4xl bg-white rounded-2xl shadow-md border transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.015]"
//               >
//                 {isLoading && (
//                   <div className="absolute inset-0 bg-white bg-opacity-60 rounded-2xl flex items-center justify-center z-10">
//                     <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
//                   </div>
//                 )}

//                 <Link
//                   to={`/alumni/${id}`}
//                   className="flex flex-col sm:flex-row gap-6 p-6"
//                 >
//                   <div className="shrink-0">
//                     <img
//                       src={
//                         alumni.photourl ||
//                         "https://media.istockphoto.com/id/1127115457/photo/black-hat-of-the-graduates-floating-in-the-sky.jpg?s=612x612&w=0&k=20&c=J_Hv0Lo4MAkJTygHEMZU70WqbiLaNG7HWPVJGf8Yq1g="
//                       }
//                       alt="alumni"
//                       className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-blue-500 transition-transform duration-300 hover:scale-105"
//                     />
//                   </div>

//                   <div className="flex-1 space-y-1 text-sm text-gray-800">
//                     <p><span className="font-semibold">👤 Name:</span> {alumni.fullName}</p>
//                     <p><span className="font-semibold">🎓 Batch:</span> {alumni.batch}</p>
//                     <p><span className="font-semibold">👤 Branch:</span> {alumni.branch}</p>
//                     <p><span className="font-semibold">🏫 College:</span> {alumni.collegeName}</p>
//                     <p><span className="font-semibold">⚧ Gender:</span> {alumni.gender}</p>
//                     <p className="text-base text-gray-800 font-medium mt-1">
//                       <span className="font-semibold text-green-700">🏢 Company:</span> {capitalizeEachWord(alumni.company)}
//                     </p>
//                     <p className="text-base text-gray-800 font-medium">
//                       <span className="font-semibold text-blue-800">🧑‍💼 Role:</span> {capitalizeEachWord(alumni.role)}
//                     </p>
//                     {alumni?.gate === "Qualified" && (
//                    <p><span className="font-semibold">🎯 GATE:</span> Qualified</p>
//                     )}
//                   </div>
//                 </Link>

//                 <div className="px-6 pb-4">
//                   {!isRequestSent && !isAccepted && (
//                     <textarea
//                       rows={3}
//                       placeholder="Share your reason for connecting (e.g. guidance, career advice)..."
//                       value={messages[id] || ""}
//                       onChange={(e) =>
//                         setMessages((prev) => ({
//                           ...prev,
//                           [id]: e.target.value,
//                         }))
//                       }
//                       className="w-full mt-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//                     />
//                   )}

//                   <div className="flex flex-wrap gap-4 pt-3">
//                     {!isAccepted && (
//                       <button
//                         onClick={() =>  confirmSendRequest(id)}
//                         disabled={isRequestSent || isLoading}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition ${
//                           isRequestSent
//                             ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                             : isLoading
//                             ? "bg-blue-400 text-white animate-pulse cursor-wait"
//                             : "bg-blue-600 text-white hover:bg-blue-700"
//                         }`}
//                       >
//                         {isRequestSent
//                           ? "Request Sent"
//                           : isLoading
//                           ? "Sending..."
//                           : "Send Request"}
//                       </button>
//                     )}

//                     <button
//                       onClick={() => handleSendMessage(id)}
//                       disabled={!isAccepted}
//                       className={`px-4 py-2 rounded-md text-sm font-medium transition ${
//                         isAccepted
//                           ? "bg-green-600 text-white hover:bg-green-700"
//                           : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       }`}
//                     >
//                       Go To Chat
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         {showConfirmModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
//     <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Request</h3>
//       <p className="text-sm text-gray-600 mb-4">
//         Are you sure you want to send this message to the alumni?
//       </p>
//       <div className="bg-gray-100 p-3 rounded-md text-gray-700 text-sm mb-4 whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
//   {messages[currentAlumniId]}
// </div>

//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => {
//             setShowConfirmModal(false);
//             setCurrentAlumniId(null);
//           }}
//           className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSendRequest}
//           className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       </div>

//       <div className="text-center mt-20">
//         <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-transparent">
//           Empowered by{" "}
//           <span className="underline font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
//             Aarambh38
//           </span>
//         </p>
//         <p className="text-sm text-gray-500 mt-1">
//           Connecting students with alumni mentors, one conversation at a time.
//         </p>
//       </div>
//     </div>
//   );
// }












import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoginSelectorPage from "./LoginSelectorPage";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";
import Shimmer from "./Shimmer";

export default function StudentLandingPage() {
  const capitalizeEachWord = (str) =>
    str?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";
const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const Admindata = useSelector((store) => store.admindata);
  const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  college: "",
  company: "",
  role: "",
  fullName: "",
  about: ""
});

  const [alumniList, setAlumniList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [currentAlumniId, setCurrentAlumniId] = useState(null);

  const [requestStatus, setRequestStatus] = useState({});
  const [acceptedStatus, setAcceptedStatus] = useState({});
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAlumniId, setLoadingAlumniId] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true); // Start loading

      const [alumniRes, sentRes, acceptedRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/getlistalumni`, { withCredentials: true }),
        axios.get(`${BASE_URL}/finalsendrequestlist`, { withCredentials: true }),
        axios.get(`${BASE_URL}/finallistusermessage`, { withCredentials: true }),
      ]);

      if (alumniRes.status === "fulfilled") {
        setAlumniList(alumniRes.value.data);
      }

      if (sentRes.status === "fulfilled") {
        const sentMap = {};
        sentRes.value.data.forEach((id) => {
          const stringId = typeof id === "object" ? id._id : id;
          sentMap[stringId] = true;
        });
        setRequestStatus(sentMap);
      }

      if (acceptedRes.status === "fulfilled") {
        const acceptedMap = {};
        acceptedRes.value.data.forEach((id) => {
          const stringId = typeof id === "object" ? id._id : id;
          acceptedMap[stringId] = true;
        });
        setAcceptedStatus(acceptedMap);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  fetchData();
}, []);



const confirmSendRequest = (alumniId) => {
  const message = messages[alumniId]?.trim();
  if (!message) {
    alert("Please write a message before sending.");
    return;
  }
  setCurrentAlumniId(alumniId);
  setShowConfirmModal(true);
};

const handleSendRequest = async () => {
  if (!currentAlumniId) return;
  setLoadingAlumniId(currentAlumniId);

  const message = messages[currentAlumniId];

  try {
    await axios.post(
      `${BASE_URL}/sendrequest/${currentAlumniId}`,
      { text: message },
      { withCredentials: true }
    );

    const fromuserId = Studentdata._id;
    await axios.post(
      `${BASE_URL}/sendrequestbymail`,
      { alumniId: currentAlumniId, fromuserId, message },
      { withCredentials: true }
    );

    setRequestStatus((prev) => ({
      ...prev,
      [currentAlumniId]: true,
    }));
  } catch (err) {
    console.error("Error sending request:", err);
    alert("Failed to send request.");
  } finally {
    setLoadingAlumniId(null);
    setShowConfirmModal(false);
    setCurrentAlumniId(null);
  }
};


  const handleSendMessage = (alumniId) => {
    navigate(`/chat/${alumniId}`);
  };

 const filteredAlumni = alumniList.filter((alumni) => {
  if (!showFilters) {
    // Global Search Mode
    return `${alumni.fullName} ${alumni.role} ${alumni.company} ${alumni.collegeName} ${alumni.batch} ${alumni.about}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  } else {
    // Advanced Filters Mode
    return (
      (!filters.college || alumni.collegeName?.toLowerCase().includes(filters.college.toLowerCase())) &&
      (!filters.company || alumni.company?.toLowerCase().includes(filters.company.toLowerCase())) &&
      (!filters.role || alumni.role?.toLowerCase().includes(filters.role.toLowerCase())) &&
      (!filters.fullName || alumni.fullName?.toLowerCase().includes(filters.fullName.toLowerCase()))
      
    );
  }
});



  if (!Studentdata && !Aluminidata && !Admindata) return <LoginSelectorPage />;
 if(loading) return <Shimmer/>
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      <div className="max-w-2xl mx-auto mb-10">
      <div className="max-w-4xl mx-auto mb-10">
  {!showFilters ? (
    // 🔹 Global Search Bar + Filter Button
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Search by name, role, company, college, batch, or about..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={() => {
          setShowFilters(true);
          setSearchQuery(""); // clear global search when switching
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Filters
      </button>
    </div>
  ) : (
    // 🔹 Filters UI
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      <input
        type="text"
        placeholder="Search by Name"
        value={filters.fullName}
        onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="Search by College"
        value={filters.college}
        onChange={(e) => setFilters({ ...filters, college: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <input
        type="text"
        placeholder="Search by Company"
        value={filters.company}
        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <input
        type="text"
        placeholder="Search by Role"
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      
      <button
        onClick={() => {
          setShowFilters(false);
          setFilters({ college: "", company: "", role: "", fullName: "", about: "" }); // reset filters
        }}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  )}
</div>


      </div>

      <div className="flex flex-col gap-8 items-center">
        {filteredAlumni.length === 0 ? (
          <div className="text-gray-600 text-center text-lg font-medium mt-10">
            No alumni found matching your search.
          </div>
        ) : (
          filteredAlumni.map((alumni) => {
            const id = alumni._id;
            const isRequestSent = requestStatus[id];
            const isAccepted = acceptedStatus[id];
            const isLoading = loadingAlumniId === id;

            return (Studentdata&&
              <div
                key={id}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-md border transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.015]"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-60 rounded-2xl flex items-center justify-center z-10">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                  </div>
                )}

                <Link
                  to={`/alumni/${id}`}
                  className="flex flex-col sm:flex-row gap-6 p-6"
                >
                  <div className="shrink-0">
                    <img
                      src={
                        alumni.photourl ||
                        "https://media.istockphoto.com/id/1127115457/photo/black-hat-of-the-graduates-floating-in-the-sky.jpg?s=612x612&w=0&k=20&c=J_Hv0Lo4MAkJTygHEMZU70WqbiLaNG7HWPVJGf8Yq1g="
                      }
                      alt="alumni"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-blue-500 transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-sm text-gray-800">
                    <p><span className="font-semibold">👤 Name:</span> {alumni.fullName}</p>
                    <p><span className="font-semibold">🎓 Batch:</span> {alumni.batch}</p>
                    <p><span className="font-semibold">👤 Branch:</span> {alumni.branch}</p>
                    <p><span className="font-semibold">🏫 College:</span> {alumni.collegeName}</p>
                    <p><span className="font-semibold">⚧ Gender:</span> {alumni.gender}</p>
                    <p className="text-base text-gray-800 font-medium mt-1">
                      <span className="font-semibold text-green-700">🏢 Company:</span> {capitalizeEachWord(alumni.company)}
                    </p>
                    <p className="text-base text-gray-800 font-medium">
                      <span className="font-semibold text-blue-800">🧑‍💼 Role:</span> {capitalizeEachWord(alumni.role)}
                    </p>
                    {alumni?.gate === "Qualified" && (
                   <p><span className="font-semibold">🎯 GATE:</span> Qualified</p>
                    )}
                  </div>
                </Link>

                <div className="px-6 pb-4">
                  {!isRequestSent && !isAccepted && (
                    <textarea
                      rows={3}
                      placeholder="Share your reason for connecting (e.g. guidance, career advice)..."
                      value={messages[id] || ""}
                      onChange={(e) =>
                        setMessages((prev) => ({
                          ...prev,
                          [id]: e.target.value,
                        }))
                      }
                      className="w-full mt-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  )}

                  <div className="flex flex-wrap gap-4 pt-3">
                    {!isAccepted && (
                      <button
                        onClick={() =>  confirmSendRequest(id)}
                        disabled={isRequestSent || isLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          isRequestSent
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : isLoading
                            ? "bg-blue-400 text-white animate-pulse cursor-wait"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isRequestSent
                          ? "Request Sent"
                          : isLoading
                          ? "Sending..."
                          : "Send Request"}
                      </button>
                    )}

                    <button
                      onClick={() => handleSendMessage(id)}
                      disabled={!isAccepted}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        isAccepted
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Go To Chat
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Request</h3>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to send this message to the alumni?
      </p>
      <div className="bg-gray-100 p-3 rounded-md text-gray-700 text-sm mb-4 whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
  {messages[currentAlumniId]}
</div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowConfirmModal(false);
            setCurrentAlumniId(null);
          }}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSendRequest}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}

      </div>

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
