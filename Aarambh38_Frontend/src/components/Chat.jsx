import { useState, useEffect, useRef } from "react";
import { MoreVertical, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import moment from "moment";
import LoginSelectorPage from "../LoginSelectorPage";
import { BASE_URL } from "../constants/AllUrl";
import Shimmer from "../Shimmer";
const ChatApp = () => {
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const user = Studentdata || Aluminidata;
const [messageLoading, setMessageLoading] = useState(false);
const [replyTo, setReplyTo] = useState(null);
  const [chatlist, setChatlist] = useState([]);
  //  const [previewImg, setPreviewImg] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

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
      }
       finally {
    setLoading(false); // Hide shimmer after fetch
  }
    };
    if (user) fetchUsers();
  }, [Studentdata, Aluminidata]);

  useEffect(() => {
    if (!user) return;
    socketRef.current = SocketConnection();
 
    socketRef.current.on("messageRecieved", ({ 
  fromuserId, 
  text,
  targetUserId,
  repliedtext,
  repliedToId,     // <- who wrote the message being replied to
  repliedById,     // <- who is replying
}) => {
  if (fromuserId === user._id) return;

  setMessages((prev) => [
    ...prev,
    {
      from: "them",
      text,
      repliedtext,
      createdAt: new Date().toISOString(),
      repliedToId,
      repliedById,
      targetUserId: fromuserId,
    },
  ]);
});


    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUser || !socketRef.current) return;
    socketRef.current.emit("joinchat", {
      fromuserId: user._id,
      targetuserId: selectedUser._id,
    });
  }, [selectedUser, user]);

  const fetchMessages = async (targetUserId) => {
  setMessageLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/getmessageswith/${targetUserId}`, {
      withCredentials: true,
    });

    const formatted = res.data.map((msg) => ({
      from: msg.fromuserId === user._id ? "me" : "them",
      text: msg.text,
      createdAt: msg.createdAt,
      senderId: msg.fromuserId,
      repliedtext: msg.repliedtext,
      repliedToId: msg.repliedToId,     // <- who wrote the original message
      repliedById: msg.repliedById,     // <- who is replying
    }));

    setMessages(formatted);
  } catch (err) {
    console.error("Failed to fetch messages", err);
  } finally {
    setMessageLoading(false);
  }
};



  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
    fetchMessages(user._id);
    setSidebarOpen(false);
  };

  const handleSend = () => {
  if (!input.trim() || !selectedUser) return;

  const fromuserId = user._id;
  const targetuserId = selectedUser._id;

  const isReplying = !!replyTo;
  const isReplyingToOtherUser = isReplying && replyTo.from === "them";

  const messagePayload = {
    fromuserId,
    targetuserId,
    text: input,
    repliedtext: isReplying ? replyTo.text : null,
    repliedToId: isReplying ? (isReplyingToOtherUser ? targetuserId : fromuserId) : null,
    repliedById: isReplying ? fromuserId : null,
  };

  socketRef.current.emit("sendmessage", messagePayload);

  setMessages((prev) => [
    ...prev,
    {
      from: "me",
      text: input,
      createdAt: new Date().toISOString(),
      senderId: fromuserId,
      repliedtext: messagePayload.repliedtext,
      repliedToId: messagePayload.repliedToId,
      repliedById: messagePayload.repliedById,
    },
  ]);

  setInput("");
  setReplyTo(null);
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
    u.fullName?.toLowerCase().includes(search.toLowerCase())
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
 if(!fetchMessages) return <Shimmer />
  return (
    <div className="h-screen w-full flex bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white border-r overflow-y-auto z-40 fixed top-0 left-0 h-full sm:static sm:h-auto transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-0"} 
          ${sidebarOpen ? "block" : "hidden"} 
          sm:block sm:w-1/4`}
      >
        <div className="p-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
          Connections
        </div>
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none text-sm"
          />
        </div>
        {filteredList.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 border-b ${
              selectedUser?._id === user._id ? "bg-gray-200" : ""
            }`}
          >
            <div className="relative group">
              <div className="p-[2px] rounded-full bg-gradient-to-r from-blue-500 to-green-500">
                <img
  src={user.photourl || "/default-avatar.png"}
  alt="avatar"
  className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer hover:scale-105 transition-transform"
  onClick={(e) => {
    e.stopPropagation(); // prevent triggering selectUser
    setPreviewImg(user.photourl || "/default-avatar.png");
  }}
/>

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
        <div className="relative px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white flex justify-between items-center z-30">
          <div className="sm:hidden block">
            <Menu className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-5xl font-extrabold text-white pointer-events-none select-none">
            Aarambh38
          </div>
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
          <div className="relative z-50" ref={menuRef}>
            <MoreVertical
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black border rounded-md shadow-xl z-50 py-1">
                <ul className="text-sm">
                  {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Block</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Report</li> */}
                  <li
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
  onClick={async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`${BASE_URL}/clearchat/${selectedUser._id}`, {
        withCredentials: true,
      });
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  }}
>
  Clear Chat
</li>


                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-6 z-10">
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
      key={index}
      className={`flex items-end gap-2 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      {!isMe && (
        <img
          src={sender?.photourl || "/default-avatar.png"}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border"
        />
      )}

      <div className="flex flex-col max-w-[80%] sm:max-w-xs relative group">
        {/* Message bubble with reply and tooltip */}
        <div
          className={`px-4 py-2 break-words rounded-lg shadow text-white text-sm relative ${
            isMe ? "bg-green-600 self-end" : "bg-blue-600"
          }`}
        >
          {/* Replied message */}
{msg.repliedtext && (
  <div className="bg-white bg-opacity-20 text-xs text-gray-100 px-3 py-2 rounded mb-1 border-l-2 border-gray-300">
    <div className="mb-1 font-semibold">
      {msg.repliedToId === user._id ? "You" : selectedUser?.fullName || "Someone"}
    </div>
    <div className="italic text-gray-200 truncate">{msg.repliedtext}</div>
  </div>
)}






<div>{msg.text}</div>
        </div>

        {/* ↩ Reply button (visible on hover or always on mobile) */}
        {/* Reply Icon Button */}
<button
  onClick={() => setReplyTo(msg)}
  className="absolute -top-3 -right-3 sm:group-hover:flex sm:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition-all duration-200"
  title="Reply"
>
  ↩
</button>


        {/* Sender and time */}
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
    <div className="text-gray-800 truncate">{replyTo.text}</div>
    <button
      className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-sm"
      onClick={() => setReplyTo(null)}
    >
      ✕
    </button>
  </div>
)}

        {/* Input */}
        <div className="p-4 border-t bg-white flex gap-2 z-10">
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
          <button
            onClick={handleSend}
            disabled={!selectedUser}
            className={`px-4 py-2 rounded-full text-white ${
              selectedUser
                ? "bg-gradient-to-r from-blue-600 to-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
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

    </div>
  );
};

export default ChatApp;
