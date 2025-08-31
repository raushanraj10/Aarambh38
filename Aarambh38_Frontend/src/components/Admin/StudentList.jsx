// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ChevronDown, ChevronUp, Trash2, Mail, X } from "lucide-react";
// import { BASE_URL } from "../../constants/AllUrl";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Shimmer from "../../Shimmer";
// import moment from "moment";


// const StudentList = () => {
//   const [alumni, setAlumni] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [confirmSendModal, setConfirmSendModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

//   const [selectedEmail, setSelectedEmail] = useState("");
//   const [emailSubject, setEmailSubject] = useState("");
//   const [emailMessage, setEmailMessage] = useState("");

//   const [selectedImage, setSelectedImage] = useState(null);

//   const admin = useSelector((state) => state.admindata);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!admin) navigate("/loginselectorpage");
//   }, [admin]);

//   useEffect(() => {
//     fetchAlumni();
//   }, []);

//   const fetchAlumni = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/getallstudent`, {
//         withCredentials: true,
//       });
//       setAlumni(res.data);
//     } catch (err) {
//       console.error("Failed to fetch student:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedId((prev) => (prev === id ? null : id));
//   };

//   const deleteStudent = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/deletestudent/${id}`, {
//         withCredentials: true,
//       });
//       fetchAlumni();
//       setDeleteModal({ show: false, id: null });
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const openEmailModal = (email) => {
//     setSelectedEmail(email);
//     setEmailSubject("Aarambh38 Student Message");
//     setEmailMessage("");
//     setIsModalOpen(true);
//   };

//   const handleSendEmail = async () => {
//     try {
//       await axios.post(
//         `${BASE_URL}/sendemailtouser`,
//         {
//           to: selectedEmail,
//           subject: emailSubject,
//           message: emailMessage,
//         },
//         { withCredentials: true }
//       );
//       setIsModalOpen(false);
//       setConfirmSendModal(false);
//     } catch (err) {
//       console.error("Failed to send email:", err);
//       alert("Failed to send email.");
//     }
//   };

//   const filteredAlumni = alumni.filter((a) =>
//     a.fullName.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading) return <Shimmer />;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 text-center mb-6">
//           Student Management Panel
//         </h1>

//         <div className="mb-6">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search students by name..."
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         <div className="bg-white shadow rounded-lg divide-y">
//           {filteredAlumni.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               No students found matching your search.
//             </div>
//           ) : (
//             filteredAlumni.map((alum) => (
//               <div
//                 key={alum._id}
//                 className="py-4 transition-all duration-200 hover:bg-gray-50"
//               >
//                 <div
//                   onClick={() => toggleExpand(alum._id)}
//                   className="flex items-center justify-between px-6 cursor-pointer"
//                 >
//                   <div className="flex items-center gap-4">
//                     {alum.photourl ? (
//                       <img
//                         src={alum.photourl}
//                         className="w-12 h-12 rounded-full object-cover shadow cursor-pointer"
//                         alt={alum.fullName}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedImage(alum.photourl);
//                         }}
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow">
//                         {alum.fullName?.[0]?.toUpperCase() || "?"}
//                       </div>
//                     )}

//                     <div>
//                       <p className="font-semibold">{alum.fullName}</p>
//                       <p className="text-sm text-gray-500">{alum.emailId}</p>
//                       <p className="text-sm text-gray-600">
//                         {alum.collegeName}
//                       </p>
//                     </div>
//                   </div>
//                   {expandedId === alum._id ? (
//                     <ChevronUp className="text-gray-500" />
//                   ) : (
//                     <ChevronDown className="text-gray-500" />
//                   )}
//                 </div>

//                 {expandedId === alum._id && (
//   <div className="bg-gray-50 px-6 mt-4 text-sm text-gray-700">
//     <div className="flex justify-between items-center">
//       {/* Left: Student details */}
//       <div className="space-y-1">
//         <p><strong>Gender:</strong> {alum.gender}</p>
//         <p><strong>College:</strong> {alum.collegeName}</p>
//         <p><strong>Branch:</strong> {alum.branch}</p>
//         <p><strong>Batch:</strong> {alum.batch}</p>
//         <p><strong>Age:</strong> {alum.age}</p>
//         <p><strong>Mobile:</strong> {alum.mobileNumber}</p>
//         <p><strong>Registration Number:</strong> {alum.registration}</p>
//       </div>

//       {/* Right: Added On */}
//       <p className="text-xs text-gray-400 ml-4 self-center">
//         <strong>Added On:</strong> {moment(alum.createdAt).format("DD MMM YYYY, h:mm A")}
//       </p>
//     </div>

//     {/* Action buttons */}
//     <div className="flex gap-4 pt-4">
//       <button
//         onClick={() => setDeleteModal({ show: true, id: alum._id })}
//         className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
//       >
//         <Trash2 size={16} /> Delete Student
//       </button>
//       <button
//         onClick={() => openEmailModal(alum.emailId)}
//         className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
//       >
//         <Mail size={16} /> Send Email
//       </button>
//     </div>
//   </div>
// )}



//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* 📩 Email Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
//             <h2 className="text-xl font-bold text-gray-800">Send Email</h2>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium">To</label>
//               <input
//                 type="email"
//                 value={selectedEmail}
//                 readOnly
//                 className="w-full px-3 py-2 border rounded-md bg-gray-100"
//               />

//               <label className="block text-sm font-medium">Subject</label>
//               <input
//                 type="text"
//                 value={emailSubject}
//                 onChange={(e) => setEmailSubject(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md"
//               />

//               <label className="block text-sm font-medium">Message</label>
//               <textarea
//                 value={emailMessage}
//                 onChange={(e) => setEmailMessage(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md h-32 resize-none"
//               />
//             </div>

//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => setConfirmSendModal(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Confirm Email Send Modal */}
//       {confirmSendModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
//             <h2 className="text-lg font-semibold mb-4">Confirm Send</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to send this email to{" "}
//               <strong>{selectedEmail}</strong>?
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setConfirmSendModal(false)}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendEmail}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🗑️ Confirm Delete Modal */}
//       {deleteModal.show && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
//             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to delete this student? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setDeleteModal({ show: false, id: null })}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => deleteStudent(deleteModal.id)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🖼️ Image Modal */}
//       {selectedImage && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
//           <div className="relative">
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1 m-2 hover:bg-opacity-75"
//             >
//               <X size={24} />
//             </button>
//             <img
//               src={selectedImage}
//               alt="Full view"
//               className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentList;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Trash2, Mail, X } from "lucide-react";
import { BASE_URL } from "../../constants/AllUrl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../Shimmer";
import moment from "moment";

const StudentList = () => {
  const [alumni, setAlumni] = useState([]);
  const [expandedCollege, setExpandedCollege] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSendModal, setConfirmSendModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const [selectedEmail, setSelectedEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [actionLoading, setActionLoading] = useState(false); // prevent double-click
  const [popupMessage, setPopupMessage] = useState(null); // success/error popup

  const admin = useSelector((state) => state.admindata);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) navigate("/loginselectorpage");
  }, [admin]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getallstudent`, {
        withCredentials: true,
      });
      setAlumni(res.data);
    } catch (err) {
      console.error("Failed to fetch student:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (alumni.length > 0) {
    const grouped = alumni.reduce((acc, student) => {
      if (!acc[student.collegeName]) acc[student.collegeName] = [];
      acc[student.collegeName].push(student);
      return acc;
    }, {});

    const colleges = Object.keys(grouped).sort((a, b) => {
      if (a === admin?.collegeName) return -1;
      if (b === admin?.collegeName) return 1;
      return a.localeCompare(b);
    });

    if (colleges.length > 0) {
      setExpandedCollege(colleges[0]); // first college auto-expanded
    }
  }
}, [alumni, admin]);

  const toggleExpandCollege = (collegeName) => {
    setExpandedCollege((prev) => (prev === collegeName ? null : collegeName));
    setExpandedId(null);
  };

  const toggleExpandStudent = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const deleteStudent = async (id) => {
    try {
      setActionLoading(true);
      await axios.delete(`${BASE_URL}/deletestudent/${id}`, {
        withCredentials: true,
      });
      fetchAlumni();
      setDeleteModal({ show: false, id: null });
      setPopupMessage({ type: "success", text: "Student deleted successfully!" });
    } catch (err) {
      console.error("Delete failed:", err);
      setPopupMessage({ type: "error", text: "Failed to delete student." });
    } finally {
      setActionLoading(false);
    }
  };

  const openEmailModal = (email) => {
    setSelectedEmail(email);
    setEmailSubject("Aarambh38 Student Message");
    setEmailMessage("");
    setIsModalOpen(true);
  };

  // when popupMessage changes, start auto-close timer
useEffect(() => {
  if (popupMessage) {
    const timer = setTimeout(() => {
      setPopupMessage(null);
    }, 2500);
    return () => clearTimeout(timer); // cleanup if popup re-renders quickly
  }
}, [popupMessage]);


  const handleSendEmail = async () => {
    try {
      setActionLoading(true);
      await axios.post(
        `${BASE_URL}/sendemailtouser`,
        {
          to: selectedEmail,
          subject: emailSubject,
          message: emailMessage,
        },
        { withCredentials: true }
      );
      setIsModalOpen(false);
      setConfirmSendModal(false);
      setPopupMessage({ type: "success", text: "Email sent successfully!" });
    } catch (err) {
      console.error("Failed to send email:", err);
      setPopupMessage({ type: "error", text: "Failed to send email." });
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 Group students by college
  const groupedByCollege = alumni.reduce((acc, student) => {
    if (!acc[student.collegeName]) acc[student.collegeName] = [];
    acc[student.collegeName].push(student);
    return acc;
  }, {});

  // 🔹 Sort colleges: admin’s college first
  const sortedColleges = Object.keys(groupedByCollege).sort((a, b) => {
    if (a === admin?.collegeName) return -1;
    if (b === admin?.collegeName) return 1;
    return a.localeCompare(b);
  });

  if (loading) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative text-center mb-10">
  <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 relative inline-block px-6 py-2">
    {admin?.collegeName}
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-700 to-green-600 rounded-full"></span>
  </h2>
</div>
       <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 text-center mb-6">
  Student Management Panel
</h1>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Batch, or Registration No..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* College wise dropdowns */}
       <div className="space-y-4">
  {sortedColleges.map((college) => {
    const students = groupedByCollege[college].filter((s) => {
      const query = search.toLowerCase();
      return (
        s?.fullName?.toLowerCase().includes(query) ||
        s?.batch?.toString().toLowerCase().includes(query) ||
        s.registration?.toString().toLowerCase().includes(query)
      );
    });

    if (students.length === 0) return null;

    return (
      <div key={college} className="bg-white shadow rounded-lg">
        {/* College header */}
        <div
          onClick={() => toggleExpandCollege(college)}
          className="flex items-center justify-between px-6 py-3 cursor-pointer rounded-t-lg
             bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500
             hover:from-purple-700 hover:via-pink-700 hover:to-yellow-700
             transition-all duration-300"
        >
          <h2 className="font-bold text-lg text-white drop-shadow-sm capitalize">
            {college}
          </h2>

          {/* Right side: student count + arrow */}
          <div className="flex items-center gap-4 text-white">
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {students.length} {students.length === 1 ? "Student" : "Students"}
            </span>
            <div
              className={`transform transition-transform duration-300 ${
                expandedCollege === college ? "rotate-180" : ""
              }`}
            >
              {expandedCollege === college ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
        </div>

        {/* Students list inside college */}
        {expandedCollege === college && (
          <div className="divide-y">
            {students.map((alum) => (
              <div
                key={alum._id}
                className="py-4 transition-all duration-200 hover:bg-gray-50"
              >
                <div
                  onClick={() => toggleExpandStudent(alum._id)}
                  className="flex items-center justify-between px-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {alum.photourl ? (
                      <img
                        src={alum.photourl}
                        className="w-12 h-12 rounded-full object-cover shadow cursor-pointer"
                        alt={alum.fullName}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(alum.photourl);
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow">
                        {alum.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{alum.fullName}</p>
                      <p className="text-sm text-gray-500">{alum.registration}</p>
                      <p className="text-sm text-gray-500">{alum.emailId}</p>
                      
                    </div>
                  </div>
                  {expandedId === alum._id ? (
                    <ChevronUp className="text-gray-500" />
                  ) : (
                    <ChevronDown className="text-gray-500" />
                  )}
                </div>

                {expandedId === alum._id && (
                  <div className="bg-gray-50 px-6 mt-4 text-sm text-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p>
                          <strong>Gender:</strong> {alum.gender}
                        </p>
                        <p>
                          <strong>Branch:</strong> {alum.branch}
                        </p>
                        <p>
                          <strong>Batch:</strong> {alum.batch}
                        </p>
                        <p>
                          <strong>Age:</strong> {alum.age}
                        </p>
                        <p>
                          <strong>Mobile:</strong> {alum.mobileNumber}
                        </p>
                        {/* <p>
                          <strong>Registration:</strong> {alum.registration}
                        </p> */}
                      </div>
                      <p className="text-xs text-gray-400 ml-4 self-center">
                        <strong>Added On:</strong>{" "}
                        {moment(alum.createdAt).format("DD MMM YYYY, h:mm A")}
                      </p>
                    </div>

                    {/* Show buttons only if same college */}
                    {admin?.collegeName === alum.collegeName && (
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={() =>
                            !actionLoading &&
                            setDeleteModal({ show: true, id: alum._id })
                          }
                          disabled={actionLoading}
                          className={`flex items-center gap-2 px-4 py-2 text-white rounded-md 
                            ${
                              actionLoading
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                        <button
                          onClick={() =>
                            !actionLoading && openEmailModal(alum.emailId)
                          }
                          disabled={actionLoading}
                          className={`flex items-center gap-2 px-4 py-2 text-white rounded-md 
                            ${
                              actionLoading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                          <Mail size={16} /> Send Email
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })}
</div>

      </div>

      {/* 📩 Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Send Email</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">To</label>
              <input
                type="email"
                value={selectedEmail}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
              <label className="block text-sm font-medium">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <label className="block text-sm font-medium">Message</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32 resize-none"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmSendModal(true)}
                disabled={actionLoading}
                className={`px-4 py-2 text-white rounded-md 
                  ${
                    actionLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Confirm Email Send Modal */}
      {confirmSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Send</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to send this email to{" "}
              <strong>{selectedEmail}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmSendModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={actionLoading}
                className={`px-4 py-2 text-white rounded-md 
                  ${
                    actionLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Confirm Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStudent(deleteModal.id)}
                disabled={actionLoading}
                className={`px-4 py-2 text-white rounded-md 
                  ${
                    actionLoading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1 m-2 hover:bg-opacity-75"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}

      {/* 🔔 Popup Message */}
      {popupMessage && (
  <div className="fixed inset-0 flex items-center justify-center z-[9999]">
    <div
      className={`px-6 py-3 rounded-lg shadow-lg text-white text-center transition-all duration-300
        ${popupMessage.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {popupMessage.text}
    </div>
  </div>
)}

    </div>
  );
};

export default StudentList;
