// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, XCircle, Ban } from "lucide-react";
// import { BASE_URL } from "./constants/AllUrl";
// import Shimmer from "./Shimmer";

// export default function AlumniReceivedRequest() {
//   const [requests, setRequests] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [confirmModal, setConfirmModal] = useState({ show: false, studentId: null, action: null });
//   const [loading, setLoading] = useState(true);

//   const Aluminidata = useSelector((store) => store.aluminidata);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!Aluminidata) {
//       navigate("/loginselectorpage");
//       return;
//     }

//     const fetchRequests = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/alumnirecivedrequest`, {
//           withCredentials: true,
//         });
//         setRequests(res.data);
//       } catch (err) {
//         console.error("Error fetching requests:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [Aluminidata, navigate]);

//   const handleAction = async () => {
//     const { studentId, action } = confirmModal;
//     setLoadingId(studentId);
//     setConfirmModal({ show: false, studentId: null, action: null });

//     try {
//       await axios.post(
//         `${BASE_URL}/alumni/${action}/${studentId}`,
//         {},
//         { withCredentials: true }
//       );

//       setRequests((prev) => prev.filter((req) => req.fromuserId._id !== studentId));
//     } catch (err) {
//       console.error("Error handling request:", err.response?.data || err.message);
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   if (loading) return <Shimmer />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
//       <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
//         Incoming Student Requests
//       </h2>

//       <div className="max-w-5xl mx-auto flex flex-col gap-8">
//         {requests.length === 0 ? (
//           <p className="text-center text-gray-500 text-lg">No pending requests.</p>
//         ) : (
//           requests.map((req) => {
//             const isLoading = loadingId === req.fromuserId._id;

//             return (
//               <div
//                 key={req._id}
//                 className="relative bg-white shadow-lg rounded-2xl border p-6 md:p-8 flex flex-col gap-4 hover:shadow-xl transition"
//               >
//                 {isLoading && (
//                   <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-10">
//                     <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//                   </div>
//                 )}

//                 <div className="flex items-start gap-4 text-gray-800 text-sm md:text-base">
//                   <img
//                     src={req.fromuserId.photourl}
//                     alt="Profile"
//                     onClick={() => setPreviewImage(req.fromuserId.photourl)}
//                     className="w-16 h-16 rounded-full border object-cover cursor-pointer hover:scale-105 transition-transform"
//                   />

//                   <div className="space-y-1">
//                     <p><strong>👤 Name:</strong> {req.fromuserId.fullName}</p>
//                     <p><strong>🎓 Batch:</strong> {req.fromuserId.batch}</p>
//                     <p><strong>🏫 College:</strong> {req.fromuserId.collegeName}</p>
//                     <p><strong>🏬 Branch:</strong> {req.fromuserId.branch}</p>
//                     <p><strong>🏫 Age:</strong> {req.fromuserId.age}</p>
//                     <p><strong>🏬 Gender:</strong> {req.fromuserId.gender}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-gray-700">
//                   <p className="font-semibold">💬 Message:</p>
//                   <p className="mt-1 whitespace-pre-line">{req.text}</p>
//                 </div>

//                 <div className="flex flex-wrap gap-4 pt-4 z-0">
//                   <button
//                     onClick={() => setConfirmModal({ show: true, studentId: req.fromuserId._id, action: "accepted" })}
//                     disabled={isLoading}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
//                       isLoading ? "bg-green-300 cursor-wait" : "bg-green-600 hover:bg-green-700"
//                     }`}
//                   >
//                     <CheckCircle size={18} />
//                     Accept
//                   </button>

//                   <button
//                     onClick={() => setConfirmModal({ show: true, studentId: req.fromuserId._id, action: "rejected" })}
//                     disabled={isLoading}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
//                       isLoading ? "bg-yellow-300 cursor-wait" : "bg-yellow-500 hover:bg-yellow-600"
//                     }`}
//                   >
//                     <XCircle size={18} />
//                     Reject
//                   </button>

//                   <button
//                     onClick={() => setConfirmModal({ show: true, studentId: req.fromuserId._id, action: "blocked" })}
//                     disabled={isLoading}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
//                       isLoading ? "bg-red-300 cursor-wait" : "bg-red-600 hover:bg-red-700"
//                     }`}
//                   >
//                     <Ban size={18} />
//                     Block
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//           onClick={() => setPreviewImage(null)}
//         >
//           <img
//             src={previewImage}
//             alt="Enlarged"
//             className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl border-4 border-white shadow-2xl transition"
//           />
//         </div>
//       )}

//       {/* ✅ Custom Confirmation Modal */}
//       {confirmModal.show && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Confirm Action
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to <span className="font-semibold text-blue-600">{confirmModal.action}</span> this request?
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setConfirmModal({ show: false, studentId: null, action: null })}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAction}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="text-center mt-24">
//         <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-transparent">
//           Empowered by{" "}
//           <span className="underline font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
//             संyukt38
//           </span>
//         </p>
//         <p className="text-sm text-gray-500 mt-1">
//           Guiding students through mentorship, one message at a time.
//         </p>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Ban, Search } from "lucide-react"; // ✅ Added Search icon
import { BASE_URL } from "./constants/AllUrl";
import Shimmer from "./Shimmer";

export default function AlumniReceivedRequest() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, studentId: null, action: null });
  const [loading, setLoading] = useState(true);

  const Aluminidata = useSelector((store) => store.aluminidata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Aluminidata) {
      navigate("/loginselectorpage");
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/alumnirecivedrequest`, {
          withCredentials: true,
        });
        setRequests(res.data);
        setFilteredRequests(res.data); // ✅ initialize
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [Aluminidata, navigate]);

  // ✅ Search filter logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredRequests(
      requests.filter((req) =>
        req.fromuserId.fullName.toLowerCase().includes(q) ||
        req.fromuserId.batch?.toString().includes(q) ||
        req.fromuserId.collegeName.toLowerCase().includes(q) ||
        req.fromuserId.branch.toLowerCase().includes(q) ||
        req.fromuserId.age?.toString().includes(q) ||
        req.fromuserId.gender?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, requests]);

  const handleAction = async () => {
    const { studentId, action } = confirmModal;
    setLoadingId(studentId);
    setConfirmModal({ show: false, studentId: null, action: null });

    try {
      await axios.post(
        `${BASE_URL}/alumni/${action}/${studentId}`,
        {},
        { withCredentials: true }
      );

      setRequests((prev) => prev.filter((req) => req.fromuserId._id !== studentId));
    } catch (err) {
      console.error("Error handling request:", err.response?.data || err.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-100 px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-6">
        Incoming Student Requests
      </h2>

      {/* ✅ Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, batch, college, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No matching requests.</p>
        ) : (
          filteredRequests.map((req) => {
            const isLoading = loadingId === req.fromuserId._id;

            return (
              <div
                key={req._id}
                className="relative bg-white shadow-lg rounded-2xl border p-6 md:p-8 flex flex-col gap-4 hover:shadow-xl transition"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-10">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}

                <div className="flex items-start gap-4 text-gray-800 text-sm md:text-base">
                  <img
                    src={req.fromuserId.photourl}
                    alt="Profile"
                    onClick={() => setPreviewImage(req.fromuserId.photourl)}
                    className="w-16 h-16 rounded-full border object-cover cursor-pointer hover:scale-105 transition-transform"
                  />

                  <div className="space-y-1">
                    <p><strong>👤 Name:</strong> {req.fromuserId.fullName}</p>
                    <p><strong>🎓 Batch:</strong> {req.fromuserId.batch}</p>
                    <p><strong>🏫 College:</strong> {req.fromuserId.collegeName}</p>
                    <p><strong>🏬 Branch:</strong> {req.fromuserId.branch}</p>
                    <p><strong>🏫 Age:</strong> {req.fromuserId.age}</p>
                    <p><strong>🏬 Gender:</strong> {req.fromuserId.gender}</p>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-gray-700">
                  <p className="font-semibold">💬 Message:</p>
                  <p className="mt-1 whitespace-pre-line">{req.text}</p>
                </div>

                {/* ✅ Action buttons */}
                <div className="flex flex-wrap gap-4 pt-4 z-0">
                  <button
                    onClick={() => setConfirmModal({ show: true, studentId: req.fromuserId._id, action: "accepted" })}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                      isLoading ? "bg-green-300 cursor-wait" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>

                  <button
                    onClick={() => setConfirmModal({ show: true, studentId: req.fromuserId._id, action: "rejected" })}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                      isLoading ? "bg-yellow-300 cursor-wait" : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  <button
                    onClick={() => setConfirmModal({ show: true, studentId: req.fromuserId._id, action: "blocked" })}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                      isLoading ? "bg-red-300 cursor-wait" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    <Ban size={18} />
                    Block
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🔍 Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Enlarged"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl border-4 border-white shadow-2xl transition"
          />
        </div>
      )}

      {/* ✅ Custom Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to <span className="font-semibold text-blue-600">{confirmModal.action}</span> this request?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmModal({ show: false, studentId: null, action: null })}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
            संyukt38
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Guiding students through mentorship, one message at a time.
        </p>
      </div>
    </div>
  );
}
