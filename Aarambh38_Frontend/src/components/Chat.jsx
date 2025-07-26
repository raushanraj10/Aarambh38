import { useState, useEffect, useRef } from "react";
import { MoreVertical, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import moment from "moment";
import LoginSelectorPage from "../LoginSelectorPage";
import { BASE_URL } from "../constants/AllUrl";

// ... all imports remain the same

const ChatApp = () => {
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const user = Studentdata || Aluminidata;

  const [chatlist, setChatlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint = Studentdata
          ? `${BASE_URL}/mymentors`
          : `${BASE_URL}/getalumnimentees`;

        const res = await axios.get(endpoint, { withCredentials: true });
        setChatlist(res.data);
        // Removed auto-select logic
      } catch (error) {
        console.error("Failed to load chat users", error);
      }
    };
    if (user) fetchUsers();
  }, [Studentdata, Aluminidata]);

  useEffect(() => {
    if (!user) return;

    socketRef.current = SocketConnection();

    socketRef.current.on("messageRecieved", ({ fromuserId, text }) => {
      if (fromuserId === user._id) return;
      setMessages((prev) => [
        ...prev,
        {
          from: "them",
          text,
          createdAt: new Date().toISOString(),
          senderId: fromuserId,
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
    try {
      const res = await axios.get(
        `${BASE_URL}/getmessageswith/${targetUserId}`,
        { withCredentials: true }
      );

      const formatted = res.data.map((msg) => ({
        from: msg.fromuserId === user._id ? "me" : "them",
        text: msg.text,
        createdAt: msg.createdAt,
        senderId: msg.fromuserId,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to fetch messages", err);
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

    socketRef.current.emit("sendmessage", {
      fromuserId,
      targetuserId,
      text: input,
    });

    setMessages((prev) => [
      ...prev,
      {
        from: "me",
        text: input,
        createdAt: new Date().toISOString(),
        senderId: fromuserId,
      },
    ]);

    setInput("");
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

  if (!Studentdata && !Aluminidata) return <LoginSelectorPage />;

  const filteredList = chatlist.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="px-4 pb-3 sm:pb-2 sm:px-4">
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
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
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

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative z-0 overflow-hidden">
        {/* Top Navbar */}
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
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Block</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Report</li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setMessages([])}
                  >
                    Clear Chat
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 z-10">
          {selectedUser ? (
            messages.map((msg, index) => {
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

                  <div className="flex flex-col max-w-xs">
                    <div
                      className={`px-4 py-2 rounded-lg shadow text-white text-sm ${
                        isMe ? "bg-green-600 self-end" : "bg-blue-600"
                      }`}
                    >
                      <div>{msg.text}</div>
                    </div>
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
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
                Aarambh38
              </div>
              <p className="text-lg">Select a user from the left panel to start chatting.</p>
            </div>
          )}
        </div>

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
    </div>
  );
};

export default ChatApp;

