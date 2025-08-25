import { useState, useEffect, useRef } from "react";
import { MoreVertical, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import moment from "moment";
import LoginSelectorPage from "../LoginSelectorPage";
import { BASE_URL } from "../constants/AllUrl";
import Shimmer from "../Shimmer";
import { Paperclip } from "lucide-react";
import { Camera, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatHelpPage from "./ChatHelp";
import { Loader2 } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
 // holds messageIds being deleted





const ChatApp = () => {
  const StudentData = useSelector((store) => store.studentdata);
  const AlumniData = useSelector((store) => store.aluminidata);
  const Navigate = useNavigate();
// const [readedlist, setReadedlist] = useState([]);
  useEffect(() => {
    if (!StudentData && !AlumniData) return Navigate("/loginselectorpage");
  }, [StudentData, AlumniData, Navigate]);
 const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });
const [pendingMessages, setPendingMessages] = useState([]);
const [deletingMessages, setDeletingMessages] = useState([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const fileInputRef = useRef();
  const docInputRef = useRef(null);
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const user = Studentdata || Aluminidata;
  const [messageLoading, setMessageLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [chatlist, setChatlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageRefs = useRef({});
  const [reloadConnections, setReloadConnections] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [originalDocName, setOriginalDocName] = useState("");
  const [documentPreview, setDocumentPreview] = useState(null);
  const [originalName, setOriginalName] = useState("");
const [readedList, setReadedList] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
 // Example helper
const isUnread = (userId) => {
  if (!readedList || readedList.length === 0) {
    return false; // nothing unread
  }
  if(selectedUser?._id===userId) return false
  return readedList.includes(userId.toString()); // true if this user is unread
};




useEffect(() => {
  if (!StudentData && !AlumniData) return;

  const fetchReadedList = async () => {
    try {
      if (StudentData) {
        const res = await axios.get(`${BASE_URL}/studentreaded`, { withCredentials: true });
        setReadedList(res.data);
      }
      if (AlumniData) {
        const res = await axios.get(`${BASE_URL}/alumnireaded`, { withCredentials: true });
        setReadedList(res.data);
      }
    } catch (error) {
      console.error("Error fetching readed list:", error);
    }
  };

   fetchReadedList();

  // create interval that always calls fresh function
  const interval = setInterval(() => {
    fetchReadedList();
  }, 5000);

  return () => clearInterval(interval);
}, [StudentData, AlumniData,selectedUser]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        setShowAttachmentOptions(false);
      }
    };

    if (showAttachmentOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAttachmentOptions]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint = Studentdata
          ? `${BASE_URL}/mymentors`
          : `${BASE_URL}/getalumnimentees`;
        const res = await axios.get(endpoint, { withCredentials: true });
        setChatlist(res.data);
      } catch (error) {
        console.error("Failed to load chat users", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUsers();
  }, [Studentdata, Aluminidata, reloadConnections, user]);

useEffect(() => {
  if (!user || !selectedUser?._id) return;

  socketRef.current = SocketConnection();

  socketRef.current.on(
    "messageRecieved",
    ({
      fromuserId,
      targetuserId, // make sure backend emits this
      messageId,
      text,
      image,
      document,
      originalFilename,
      repliedtext,
      repliedImage,
      repliedDocument,
      repliedMessageId,
      repliedOriginalFilename,
      repliedToId,
      repliedById,
      messageType,
      createdAt,
    }) => {
      if (fromuserId === user._id) return;
      // Ignore messages that are not part of this conversation
      if (
        !(
          (fromuserId === selectedUser._id && targetuserId === user._id) ||
          (fromuserId === user._id && targetuserId === selectedUser._id)
        )
      ) {
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          from: fromuserId === user._id ? "me" : "them",
          text,
          image,
          document,
          originalFilename,
          repliedMessageId,
          messageType,
          createdAt: createdAt || new Date().toISOString(),
          repliedtext,
          repliedImage,
          repliedDocument,
          messageId,
          repliedOriginalFilename,
          repliedToId,
          repliedById,
          targetUserId: targetuserId,
        },
      ]);
    }
  );

  return () => {
    socketRef.current?.off("messageRecieved");
    socketRef.current?.disconnect();
  };
}, [user?._id, selectedUser?._id]);



  useEffect(() => {
    if (!user || !selectedUser || !socketRef.current) return;
    socketRef.current.emit("joinchat", {
      fromuserId: user._id,
      targetuserId: selectedUser._id,
    });
  }, [selectedUser, user]);

  const handleDocumentChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setOriginalDocName(file.name);
  setDocumentPreview(file.name);
  const reader = new FileReader();
  reader.onloadend = () => setDocumentFile(reader.result);
  reader.readAsDataURL(file);
};

  const fetchMessages = async (targetUserId) => {
    setMessageLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getmessageswith/${targetUserId}`, {
        withCredentials: true,
      });

      const formatted = res.data.map((msg) => ({
        from: msg.fromuserId === user._id ? "me" : "them",
        text: msg.text,
        image: msg.image,
        document: msg.document,    
        originalFilename: msg.originalFilename,
        messageType: msg.messageType,
        createdAt: msg.createdAt,
        senderId: msg.fromuserId,
        messageId:msg.messageId,
        repliedMessageId:msg.repliedMessageId,
        repliedtext: msg.repliedtext,
        repliedImage: msg.repliedImage,
        repliedDocument: msg.repliedDocument,
        repliedOriginalFilename: msg.repliedOriginalFilename,
        repliedToId: msg.repliedToId,
        repliedById: msg.repliedById,
        repliedToCreatedAt: msg.repliedToCreatedAt,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSelectUser = async (user) => {
  try {
    setSelectedUser(user);
    setMessages([]);
    fetchMessages(user._id);
    setSidebarOpen(false);

    if (StudentData) {
  await axios.get(`${BASE_URL}/studentreadedoff/${user._id}`, { withCredentials: true });
}

if (Aluminidata) {
  await axios.get(`${BASE_URL}/alumnireadedoff/${user._id}`, { withCredentials: true });
}


    // Optionally update state immediately so unread dot disappears
    setReadedList((prev) => prev.filter((id) => id !== user._id));

  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};


  // const handleSend = () => {
  //   if (!input.trim() && !imagePreview) return;
  //   if (!selectedUser) return;

  //   const fromuserId = user._id;
  //   const targetuserId = selectedUser._id;

  //   const isReplying = !!replyTo;
  //   const isReplyingToOtherUser = isReplying && replyTo.from === "them";

  //   const messagePayload = {
  //     fromuserId,
  //     targetuserId,
  //     text: input,
  //     image: imagePreview || "",
  //     messageType: imagePreview ? "image" : "text",
  //     repliedtext: isReplying ? replyTo.text : null,
  //     repliedImage: isReplying ? replyTo.image : null,
  //     repliedToId: isReplying ? (isReplyingToOtherUser ? targetuserId : fromuserId) : null,
  //     repliedById: isReplying ? fromuserId : null,
  //     repliedToCreatedAt: isReplying ? replyTo.createdAt : null,
  //   };

  //   socketRef.current.emit("sendmessage", messagePayload);

  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       from: "me",
  //       text: input,
  //       image: imagePreview,
  //       messageType: imagePreview ? "image" : "text",
  //       createdAt: new Date().toISOString(),
  //       senderId: fromuserId,
  //       repliedtext: messagePayload.repliedtext,
  //       repliedImage: messagePayload.repliedImage,
  //       repliedToId: messagePayload.repliedToId,
  //       repliedById: messagePayload.repliedById,
  //       repliedToCreatedAt: messagePayload.repliedToCreatedAt,
  //     },
  //   ]);

  //   setInput("");
  //   setReplyTo(null);
  //   setImageFile(null);
  //   setImagePreview(null);
  // };

  const handleJumpToMessage = (msg) => {
  if (!msg.repliedMessageId) return;

  const el = messageRefs.current[msg.repliedMessageId];
  if (el) {
    // Smooth scroll to the original message
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Temporary highlight effect
    el.classList.add("fade-highlight");
    setTimeout(() => el.classList.remove("fade-highlight"), 2000);
  }
};


  const handleSend = async () => {
  if (sending) return; // prevent double send

  try {
    // 1. Prevent empty message
    if (!input.trim() && !imagePreview && !documentFile) return;
    if (!selectedUser) return;
     const newMessageId = uuidv4();

    setSending(true);

    let documentUrl = "";

    // 2. Upload document if selected
    if (documentFile) {
      try {
        const messageId =newMessageId  
        let repliedMessageId;
        if(repliedMessageId!==null)
        repliedMessageId=newMessageId
// e.g. "550e8400-e29b-41d4-a716-446655440000"

        const uploadRes = await axios.post(
          `${BASE_URL}/uploaddocument`,
          { file: documentFile, filename: originalDocName,messageId,repliedMessageId},
          { withCredentials: true }
        );
        documentUrl = uploadRes.data.url;
      } catch (err) {
        console.error("Document upload failed:", err);
        alert("Failed to upload document. Please try again.");
        setSending(false);
        return;
      }
    }

    // 3. Prepare IDs
    const fromuserId = user._id;
    const targetuserId = selectedUser._id;
    let findId=fromuserId===Aluminidata?._id?"alumni":"student"
    // console.log(findId)
    // 4. Handle reply logic
    const isReplying = !!replyTo;
    const isReplyingToOtherUser = isReplying && replyTo.from === "them";

    // 5. Decide message type
    const messageType = imagePreview
      ? "image"
      : documentUrl
      ? "file"
      : "text";
// console.log(replyTo)
    // 6. Build message payload
    const messagePayload = {
      fromuserId,
      targetuserId,
      findId,
      messageId: newMessageId,
      text: input,
      image: imagePreview || "",
      document: documentUrl || "",
      originalFilename: originalDocName || "",
      messageType,
      repliedtext: isReplying ? replyTo.text : null,
      repliedImage: isReplying ? replyTo.image : null,
      repliedMessageId: isReplying ? replyTo.messageId : null, 
      repliedDocument: isReplying ? replyTo.document : null,
      repliedOriginalFilename: isReplying ? replyTo.originalFilename : "",
      repliedToId: isReplying
        ? isReplyingToOtherUser
          ? targetuserId
          : fromuserId
        : null,
      repliedById: isReplying ? fromuserId : null,
      repliedToCreatedAt: isReplying ? replyTo.createdAt : null,
    };

    // 7. Send message via socket
    socketRef.current.emit("sendmessage", messagePayload);

    // 8. Update local state for instant UI update
    setMessages((prev) => [
      ...prev,
      {
        from: "me",
        text: input,
        image: imagePreview,
        document: documentUrl || "",
        originalFilename: originalDocName || "",
        messageType,
        createdAt: new Date().toISOString(),
        senderId: fromuserId,
        repliedtext: messagePayload.repliedtext,
        repliedImage: messagePayload.repliedImage,
        repliedDocument: messagePayload.repliedDocument,
        repliedOriginalFilename: messagePayload.repliedOriginalFilename,
        repliedToId: messagePayload.repliedToId,
        repliedById: messagePayload.repliedById,
        messageId: messagePayload.messageId,
        repliedMessageId:messagePayload.repliedMessageId,
        repliedToCreatedAt: messagePayload.repliedToCreatedAt,
      },
    ]);

    // 9. Reset input & states
    setInput("");
    setReplyTo(null);
    setImageFile(null);
    setImagePreview(null);
    setDocumentFile(null);
    setDocumentPreview(null);
    setOriginalDocName(null);
  } catch (error) {
    console.error("Error in handleSend:", error);
    alert("Something went wrong while sending the message.");
  } finally {
    setSending(false);
  }
};


const handleRetry = async (pending) => {
  setPendingMessages(prev =>
    prev.map(p => p.id === pending.id ? { ...p, status: "uploading" } : p)
  );

  if (pending.type === "file") {
    setDocumentFile(pending.fileData);
    setOriginalDocName(pending.filename);
  }
  if (pending.type === "image") {
    setImagePreview(pending.fileData);
  }
  await handleSend();
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!Studentdata && !Aluminidata) return <LoginSelectorPage />;

  const filteredList = chatlist.filter((u) =>
    u?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((msg) => {
      const date = moment(msg.createdAt).startOf("day");
      let label = date.format("MMMM D, YYYY");
      if (date.isSame(moment(), "day")) label = "Today";
      else if (date.isSame(moment().subtract(1, "days"), "day")) label = "Yesterday";
      else if (date.isSame(moment().add(1, "days"), "day")) label = "Tomorrow";

      if (!groups[label]) groups[label] = [];
      groups[label].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);
  if (loading) return <Shimmer />;
  if (!fetchMessages) return <Shimmer />;

  return (
    <div className="h-screen w-full flex bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <div
  className={`bg-white border-r overflow-y-auto z-40 fixed top-0 left-0 h-full sm:static sm:h-auto transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-0"} 
        ${sidebarOpen ? "block" : "hidden"} 
        sm:block sm:w-1/4`}
>
  <main className="pt-[64px] md:pt-[5px]">
    <div className="p-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
      Connections
    </div>
    <div className="px-4 pb-3">
      <input
        type="text"
        placeholder="Search connections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none text-sm bg-white"
      />
    </div>
  </main>

  {filteredList.map((user) => (
    <div
      key={user._id}
      onClick={() => handleSelectUser(user)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 border-b ${
        selectedUser?._id === user._id ? "bg-gray-200" : ""
      }`}
    >
      <div className="relative group">
        <div className="p-[2px] rounded-full bg-gradient-to-r from-blue-500 to-green-500 relative">
          <img
            src={user.photourl || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImg(user.photourl || "/default-avatar.png");
            }}
          />

          {/* ✅ Green blinking dot if unread */}
          {/* {console.log("rendering", user._id, isUnread(user._id))} */}
           {isUnread(user._id) && (
  <>
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
  </>
)}

        </div>
        <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block text-xs text-white bg-black px-2 py-1 rounded whitespace-nowrap z-10">
          {user.emailId}
        </div>
      </div>
      <span className="text-sm font-medium">{user.fullName || "Unnamed"}</span>
    </div>
  ))}
</div>

{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
    onClick={() => setSidebarOpen(false)}
  ></div>
)}


      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative z-0 overflow-hidden">
        {selectionMode && (
  <div className="flex items-center justify-between bg-gray-200 px-4 py-2">
    <span>{selectedMessages.length} selected</span>
    <div className="flex gap-2">
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => {
          if (!selectedUser || selectedMessages.length === 0) return;
          setConfirmModal({
            open: true,
            message: `Are you sure you want to delete ${selectedMessages.length} message(s)?`,
            onConfirm: async () => {
  try {
    setDeletingMessages(selectedMessages);

    // ✅ scroll to first deleted message
    const firstMsgId = selectedMessages[0];
    const firstMsgEl = messageRefs.current[firstMsgId];
    if (firstMsgEl) {
      firstMsgEl.scrollIntoView({
        behavior: "smooth",
        block: "center", // center in viewport
      });
    }

    await axios.post(
      `${BASE_URL}/deletemessages`,
      {
        messageIds: selectedMessages,
        targetUserId: selectedUser._id,
      },
      { withCredentials: true }
    );

    // delay removal so animation is visible
    setTimeout(() => {
      setMessages((prev) =>
        prev.filter((msg) => !selectedMessages.includes(msg.messageId))
      );
      setDeletingMessages([]);
    }, 1000);

    setSelectedMessages([]);
    setSelectionMode(false);
  } catch (err) {
    console.error("Failed to delete messages:", err);
  }
}

          });
        }}
      >
        Delete
      </button>

      <button
        className="bg-gray-400 text-white px-3 py-1 rounded"
        onClick={() => {
          setSelectedMessages([]);
          setSelectionMode(false);
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}


        <div className="relative px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white flex justify-between items-center z-30">
  <div className="sm:hidden block">
    <Menu className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
  </div>
<div className="absolute inset-0 flex items-center justify-center opacity-10 text-5xl font-extrabold text-white pointer-events-none select-none">
    Aarambh38
  </div>



{Aluminidata && selectedUser && (
  <div className="relative">
    <button
      disabled={sending} // disable button while sending
      className={`flex items-center justify-center h-10 w-10 hover:w-56 rounded-full
                 bg-white hover:bg-gray-100
                 shadow-md hover:shadow-lg transition-all duration-300
                 overflow-hidden group
                 ${sending ? "cursor-not-allowed opacity-70" : ""}`}
      onClick={() => {
        if (!selectedUser) return;

        setConfirmModal({
          open: true,
          message: `Are you sure you want to invite ${selectedUser?.fullName} to join online?`,
          onConfirm: async () => {
            try {
              const fullName=AlumniData.fullName
              setSending(true); // start shimmer
              await axios.post(
  `${BASE_URL}/requestonlineemail/${selectedUser._id}`,
  { fullName }, // request body
  { withCredentials: true } // config
);


              setMessages([]);
              setReloadConnections((prev) => prev + 1);

              setSuccessMsg(`Invitation sent to ${selectedUser.fullName}`);
              setTimeout(() => setSuccessMsg(""), 3000);
            } catch (err) {
              console.error("Failed to send email:", err);
            } finally {
              setSending(false); // stop shimmer
            }
          },
        });
      }}
    >
      {/* Gmail Logo or Loader */}
      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
        {sending ? (
          // Circle shimmer loader
          <div className="w-6 h-6 rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500 animate-spin"></div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg"
               className="h-6 w-6"
               viewBox="0 0 48 48">
            <path fill="#e0e0e0" d="M44 39c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V9c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v30z"/>
            <path fill="#f44336" d="M24 27L4 12V9c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v3L24 27z"/>
            <path fill="#fff" d="M24 27L4 12V9c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v3L24 27z"/>
            <path fill="#f44336" d="M44 12L24 27 4 12V9l20 15 20-15v3z"/>
          </svg>
        )}
      </div>

      {/* Gradient Expanding Text */}
      <span
        className="ml-2 whitespace-nowrap transform translate-x-5 opacity-0 
                   group-hover:translate-x-0 group-hover:opacity-100 
                   transition-all duration-300 ease-out
                   font-extrabold text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-green-600 tracking-tight"
      >
        Send Online Invite
      </span>
    </button>

    {/* Success Message */}
    {successMsg && (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 pointer-events-none">
        <div className="bg-green-600 text-white font-semibold shadow-xl px-6 py-3 rounded-2xl border border-green-500 
                        flex items-center space-x-3 animate-fade-in-down pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" 
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMsg}</span>
        </div>
      </div>
    )}
  </div>
)}












  <div className="z-10 flex items-center gap-3">
    {selectedUser && (
      <img
        src={selectedUser.photourl || "/default-avatar.png"}
        alt="selected user"
        className="w-9 h-9 rounded-full object-cover border"
      />
    )}
    <span className="text-lg font-semibold">
      {selectedUser?.fullName || "Select a user"}
    </span>


  </div>

 





  {/* Add the menu (three dots) and its dropdown here */}
  <div className="relative z-50" ref={menuRef}>
    <MoreVertical
      className="cursor-pointer"
      onClick={() => setMenuOpen(!menuOpen)}
    />

    
    {menuOpen && (
      <div className="absolute right-0 mt-2 w-44 bg-white text-black border rounded-md shadow-xl z-50 py-1">
        <ul className="text-sm">
  <li
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => {
      if (!selectedUser) return;
      setConfirmModal({
        open: true,
        message: `Are you sure you want to clear the chat with ${selectedUser.fullName}?`,
        onConfirm: async () => {
  try {
    await axios.delete(`${BASE_URL}/clearchat/${selectedUser._id}`, {
      withCredentials: true,
    });

    // ✅ trigger shimmer + exit on all messages
    const allIds = messages.map((m) => m.messageId);
    setDeletingMessages(allIds);

    // ✅ delay removal so animations are visible
    setTimeout(() => {
      setMessages([]);
      setDeletingMessages([]);
    }, 1000); // match shimmer duration
  } catch (err) {
    console.error("Failed to clear chat:", err);
  }
}

      });
    }}
  >
    Clear Chat
  </li>

  {Aluminidata&&<li
  className="px-4 py-2 cursor-pointer text-gray-700 hover:text-red-600 hover:bg-gray-50 "
  onClick={() => {
    if (!selectedUser) return;
    setConfirmModal({
      open: true,
      message: `Are you sure you want to block ${selectedUser.fullName}? They will no longer be able to message you.`,
      onConfirm: async () => {
        try {
          await axios.get(
  `${BASE_URL}/deletestudentbyalumni/${selectedUser._id}`,
   // empty body if not needed
  { withCredentials: true }
);
 await axios.delete(`${BASE_URL}/clearchat/${selectedUser._id}`, {
          withCredentials: true,
        });

          Navigate("/alumnimentees")
          // Optionally remove messages and mark as blocked
          setMessages([]);
          setReloadConnections(prev => prev + 1);
          // console.log(`${selectedUser.fullName} blocked successfully.`);
        } catch (err) {
          console.error("Failed to block user:", err);
        }
      }
    });
  }}
>
  Remove Student
</li>}


  {Aluminidata&&<li
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
  onClick={() => {
    if (!selectedUser) return;
    setConfirmModal({
      open: true,
      message: `Are you sure you want to block ${selectedUser.fullName}? They will no longer be able to message you.`,
      onConfirm: async () => {
        try {
          await axios.get(
  `${BASE_URL}/alumniblockstudent/${selectedUser._id}`,
   // empty body if not needed
  { withCredentials: true }
);
 await axios.delete(`${BASE_URL}/clearchat/${selectedUser._id}`, {
          withCredentials: true,
        });

          Navigate("/alumnimentees")
          // Optionally remove messages and mark as blocked
          setMessages([]);
          setReloadConnections(prev => prev + 1);
          // console.log(`${selectedUser.fullName} blocked successfully.`);
        } catch (err) {
          console.error("Failed to block user:", err);
        }
      }
    });
  }}
>
  Block Student
</li>}




{StudentData&&<li
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
  onClick={() => {
    if (!selectedUser) return;
    setConfirmModal({
      open: true,
      message: `Are you sure you want to block ${selectedUser.fullName}? They will no longer be able to message you.`,
      onConfirm: async () => {
        try {
          await axios.get(
  `${BASE_URL}/deletealumnibystudent/${selectedUser._id}`,
   // empty body if not needed
  { withCredentials: true }
);
 await axios.delete(`${BASE_URL}/clearchat/${selectedUser._id}`, {
          withCredentials: true,
        });
       Navigate("/landingpage")
          // Optionally remove messages and mark as blocked
          setMessages([]);
          setReloadConnections(prev => prev + 1);
          // console.log(`${selectedUser.fullName} blocked successfully.`);
        } catch (err) {
          console.error("Failed to block user:", err);
        }
      }
    });
  }}
>
  Delete Mentor
</li>}
  <li
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => { Navigate("/chathelp"); }}
  >
    Help and Tips
  </li>
</ul>

      </div>
    )}
    
  </div>
  
</div>



        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-6 z-10 min-w-0 
                break-words whitespace-normal 
                text-base sm:text-lg md:text-xl font-semibold">

          {selectedUser ? (
            messageLoading ? (
              <div className="w-full h-full flex flex-col">
                {/* Header shimmer */}
                <div className="h-16 bg-white border-b flex items-center px-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 animate-pulse" />
                  <div className="flex-1 h-6 bg-gray-300 rounded animate-pulse" />
                </div>
                {/* Chat area shimmer */}
                <div className="flex-1 bg-gray-50 p-4 space-y-4 overflow-y-auto animate-pulse">
                  <div className="h-5 w-1/3 bg-gray-300 rounded" />
                  <div className="h-4 w-1/2 bg-gray-300 rounded" />
                  <div className="h-4 w-2/3 bg-gray-300 rounded" />
                  <div className="h-4 w-1/4 bg-gray-300 rounded" />
                  <div className="h-4 w-3/4 bg-gray-300 rounded self-end" />
                  <div className="h-4 w-1/2 bg-gray-300 rounded self-end" />
                </div>
                {/* Input shimmer */}
                <div className="h-16 bg-white border-t flex items-center px-4 gap-4">
                  <div className="flex-1 h-10 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-10 w-20 bg-gray-300 rounded-full animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                {Object.entries(groupedMessages).map(([dateLabel, group]) => (
                  <div key={dateLabel}>
                    <div className="text-center text-xs text-gray-500 my-3">{dateLabel}</div>
                    {group.map((msg, index) => {
                      const isMe = msg.from === "me";
                      const sender = isMe ? user : selectedUser;
                      return (
         <div
  key={msg.messageId}
  onClick={() => {
    if (selectionMode) {
      setSelectedMessages((prev) =>
        prev.includes(msg.messageId)
          ? prev.filter((id) => id !== msg.messageId)
          : [...prev, msg.messageId]
      );
    }
  }}
  onContextMenu={(e) => {
    e.preventDefault();
    setSelectionMode(true);
    setSelectedMessages([msg.messageId]);
  }}
  ref={(el) => {
    if (el) messageRefs.current[msg.messageId] = el;
  }}
  className={`relative flex items-start gap-2 transition-all duration-200
    ${isMe ? "justify-end" : "justify-start"}
    ${
      selectedMessages.includes(msg.messageId)
        ? "bg-blue-50 border-l-4 border-blue-400 shadow-sm"
        : ""
    }
    ${deletingMessages.includes(msg.messageId) ? "opacity-50 animate-pulse" : ""}
    rounded-lg px-3 py-2`}
>

  {/* Shimmer overlay for delete (WhatsApp style) */}
  {deletingMessages.includes(msg.messageId) && (
  <div className="flush-overlay"></div>
)}

                          {!isMe && (
                            <img
                              src={sender?.photourl || "/default-avatar.png"}
                              alt="profile"
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          )}
                          <div className="flex flex-col max-w-[80%] sm:max-w-xs relative group">
                            <div
                              className={`px-4 py-2 break-words rounded-lg shadow text-white text-sm relative ${
                                isMe ? "bg-green-600 self-end" : "bg-blue-600"
                              }`}
                            >
                              {/* Replied Message */}
                              {(msg.repliedtext || msg.repliedImage || msg.repliedDocument) && (
  <div
    className="bg-white bg-opacity-20 text-xs text-gray-100 px-3 py-2 rounded mb-1 border-l-2 border-gray-300 cursor-pointer hover:bg-opacity-30 transition"
    onClick={() => {
  const el = messageRefs.current[msg.repliedMessageId];
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("fade-highlight");
    setTimeout(() => el.classList.remove("fade-highlight"), 2000);
  }
}}

  >
    <div className="mb-1 font-semibold">
      {msg.repliedById === user._id ? "You" : selectedUser?.fullName}
    </div>
    {/* Document reply */}
    {msg.repliedDocument && (
  <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition max-w-[240px]">
    
    {/* File Icon Badge */}
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100">
      <FileText className="w-5 h-5 text-blue-600" />
    </div>

    {/* File Info */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800 truncate">
        {msg.repliedOriginalFilename || msg.repliedDocument.split("/").pop() || "Document"}
      </p>
      <p className="text-xs text-gray-500">Document</p>
    </div>

    {/* Open Button */}
    <a
      href={msg.repliedDocument}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      title="Open Document"
    >
      {/* External Link Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h6m0 0v6m0-6L10 16"
        />
      </svg>
    </a>
  </div>
)}

    {/* Image reply */}
   {msg.repliedImage && (
    
  <div className="flex  mb-1  max-w-[260px] bg-slate-100 rounded-md overflow-hidden justify-between">
    
    {/* Left side: thumbnail & text */}
    <div className="flex flex-col justify-center px-2">
      {/* Image icon always above text */}
      <div className="flex items-center gap-1">
        
        <svg
          className="w-3.5 h-3.5 text-slate-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 
               2 0 01-2 2H5a2 2 0 01-2-2V7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13l4-4a2 2 0 012.828 0L15 15l4-4 
               a2 2 0 012.828 0L21 13"
          />
        </svg>
      </div>

      {/* Replied text */}
      <span className="text-xs font-medium text-slate-600 line-clamp-2 mt-0.5">
        {"Photo"}
      </span>
      
    </div>
    

    {/* Right side: preview image */}
    <div className="flex-shrink-0">
      <img
        src={msg.repliedImage}
        alt="Replied"
        className="w-12 h-12 object-cover"
      />
      
    </div>
     
  </div>
  
)}







    {/* Text reply */}
  {msg.repliedtext && (
  <div
    className="flex max-w-[240px] rounded-md cursor-pointer"
    onClick={() => handleJumpToMessage(msg)}
  >
    <div className="flex-1 min-w-0">
      {/* Sender (optional) */}
      {msg.repliedUser && (
        <p className="text-[10px] font-medium text-gray-400 mb-0.5">
          {msg.repliedUser}
        </p>
      )}

      {/* Replied Text */}
      <p className="text-sm text-gray-700 font-semibold line-clamp-3">
        {msg.repliedtext}
      </p>
    </div>
  </div>
)}







  </div>
)}


                              {/* Main Message Content */}
                              <div>
                                {msg.image && (
                                  <div
                                    className="relative group max-w-[240px] sm:max-w-[260px] overflow-hidden rounded-xl mb-1 cursor-pointer border border-gray-200 shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                                    onClick={() => setPreviewImg(msg.image)}
                                    title="Click to enlarge"
                                  >
                                    <img
                                      src={msg.image}
                                      alt="sent"
                                      className="w-full h-auto object-cover"
                                      style={{
                                        borderRadius: "12px",
                                      }}
                                    />
                                  </div>
                                )}
  {msg.messageType === "file" && msg.document && (
  <div
    className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-sm transition-all duration-200 cursor-pointer
      max-w-[260px] sm:max-w-[260px] md:max-w-[260px]
      ${isMe ? "bg-blue-50 border-blue-200 ml-auto" : "bg-white border-gray-200"}
    `}
  >
    {/* File Icon */}
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 flex-shrink-0">
      <FileText className="w-5 h-5 text-blue-600" />
    </div>

    {/* File Details */}
    <div className="flex-1 min-w-0">
      <p
        className="text-sm font-medium text-gray-900 truncate"
        title={msg.originalFilename || msg.document.split("/").pop()}
      >
        {msg.originalFilename || msg.document.split("/").pop()}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {msg.fileSize ? `${(msg.fileSize / 1024).toFixed(1)} KB` : "Document"}
      </p>
    </div>

    {/* Open Document Button */}
    <a
      href={msg.document}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      title="Open Document"
    >
      {/* External Link Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h6m0 0v6m0-6L10 16"
        />
      </svg>
    </a>
  </div>
)}







                                
                               {pendingMessages.map(p => (
  <div key={p.id} className="flex justify-end">
    <div className="px-4 py-2 rounded-lg bg-gray-200 text-sm text-gray-600 flex items-center gap-2">
      {p.type === "image" && (
        <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-md" />
      )}
      {p.type === "file" && (
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <span>{p.filename}</span>
        </div>
      )}
      {p.status === "uploading" && (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      )}
      {p.status === "failed" && (
        <button
          onClick={() => handleRetry(p)}
          className="text-red-500 text-xs underline"
        >
          Retry
        </button>
      )}
    </div>
  </div>
))}


  {msg.text  && (
  <div
    className={`flex ${
      msg.text.length < 40 ? "justify-start" : "justify-end"
    }`}
  >
    <div className="max-w-[260px] sm:max-w-[260px] whitespace-pre-wrap break-words overflow-hidden rounded-lg  py-2 text-sm text-white font-semibold ">
      {msg.text}
    </div>
  </div>
)}



                              </div>
                            </div>
                            {/* Reply button */}
                            <button
                              onClick={() => setReplyTo(msg)}
                              className="absolute -top-3 -right-3 sm:group-hover:flex sm:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition-all duration-200"
                              title="Reply"
                            >
                              ↩
                            </button>
                            {/* Sender and Time */}
                            <div
                              className={`text-xs text-gray-500 mt-1 ${
                                isMe ? "text-right" : "text-left"
                              }`}
                            >
                              {isMe ? "You" : sender?.fullName || "Them"} •{" "}
                              {moment(msg.createdAt).format("h:mm A")}
                            </div>
                          </div>
                          {isMe && (
                            <img
                              src={sender?.photourl || "/default-avatar.png"}
                              alt="profile"
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={bottomRef} />
              </>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
                Aarambh38
              </div>
              <p className="text-lg">Select a user from the left panel to start chatting.</p>
            </div>
          )}
        </div>
        {replyTo && (
          <div className="bg-gray-100 border-l-4 border-blue-500 px-3 py-2 text-sm mb-2 mx-4 rounded relative">
            <div className="text-gray-600 font-semibold">Replying to:</div>
            {replyTo.image && (
              <img
                src={replyTo.image}
                alt="replying to"
                className="max-w-[80px] max-h-[80px] rounded mt-1 mb-1 border"
              />
            )}
            {replyTo.document && (
      <div className="flex items-center gap-2 border p-2 rounded bg-white mb-1">
        <FileText className="w-5 h-5 text-gray-500" />
        <span className="truncate flex-1">{replyTo.originalFilename || "Document"}</span>
        <a
          href={replyTo.document}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-medium"
          title="Open document"
        >
        </a>
      </div>
    )}
            {replyTo.text && <div className="text-gray-800 truncate">{replyTo.text}</div>}
            <button
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-sm "
              onClick={() => setReplyTo(null)}
            >
              ✕
            </button>
          </div>
        )}
        {/* Input */}
        <div className="p-4 border-t bg-white flex flex-col gap-2 z-10">
          {/* Image preview before sending */}
          {imagePreview && (
            <div className="relative w-40 h-40 mb-2">
              <img
                src={imagePreview}
                alt="preview"
                className="object-cover w-full h-full rounded"
              />
              <button
                className="absolute top-1 right-1 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}

          {documentPreview && (
  <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-1 mt-2 max-w-xs">
    <span className="flex-1 text-gray-700 truncate">{documentPreview}</span>
    <button
      onClick={() => {
        setDocumentFile(null);
        setDocumentPreview(null);
        setOriginalName("");
      }}
      className="ml-3 text-red-500 hover:text-red-700 font-bold focus:outline-none"
      aria-label="Remove document"
      title="Remove document"
    >
      ×
    </button>
  </div>
)}



          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
              disabled={!selectedUser}
            />
            {/* File input for image upload */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachmentOptions((prev) => !prev)}
                disabled={!selectedUser}
                className={`px-3 py-2 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center ${
                  !selectedUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Attach"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              {showAttachmentOptions && (
  <div ref={attachmentMenuRef} className="absolute bottom-full mb-2 left-0 bg-white border shadow rounded z-50 w-32">
    <button
      onClick={() => {
        fileInputRef.current?.click();
        setShowAttachmentOptions(false);
      }}
      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
    >
      <Camera className="w-4 h-4" />
      Image
    </button>
    <button
      onClick={() => {
        docInputRef.current?.click();
        setShowAttachmentOptions(false);
      }}
      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
    >
      <FileText className="w-4 h-4" />
      Document
    </button>
  </div>
)}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleDocumentChange}
              />

            </div>
            <button
  onClick={handleSend}
  disabled={!selectedUser || sending}
  className={`px-4 py-2 rounded-full text-white ${
    selectedUser && !sending
      ? "bg-gradient-to-r from-blue-600 to-green-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  {sending ? "Sending..." : "Send"}
</button>

          </div>
        </div>
      </div>
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={() => setPreviewImg(null)}
        >
          <div className="max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImg}
              alt="Preview"
              className="rounded-lg object-contain max-w-[90vw] max-h-[90vh] shadow-lg"
            />
          </div>
        </div>
      )}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="text-gray-700 mb-6">{confirmModal.message}</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setConfirmModal({ ...confirmModal, open: false })}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  confirmModal.onConfirm?.();
                  setConfirmModal({ ...confirmModal, open: false });
                }}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;