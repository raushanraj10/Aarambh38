import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import { useParams } from "react-router-dom";
import moment from "moment"; // You need to install moment.js
import LoginSelectorPage from "../LoginSelectorPage";

const ChatApp = () => {
  const { touserId } = useParams();
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const user = Studentdata || Aluminidata;

  const [chatlist, setChatlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fetch chat users (mentors or mentees)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint = Studentdata
          ? "http://localhost:5000/mymentors"
          : "http://localhost:5000/getalumnimentees";

        const res = await axios.get(endpoint, { withCredentials: true });
        setChatlist(res.data);
      } catch (error) {
        console.error("Failed to load chat users", error);
      }
    };
    if (user) fetchUsers();
  }, [Studentdata, Aluminidata]);

  // Fetch previous messages
  const fetchMessages = async (targetUserId) => {
    try {
      const res = await axios.get(`http://localhost:5000/getmessageswith/${targetUserId}`, {
        withCredentials: true,
      });

      const formatted = res.data.map((msg) => ({
        from: msg.fromuserId === user._id ? "me" : "them",
        text: msg.text,
        createdAt: msg.createdAt,
        senderId: msg.fromuserId,
      }));
    //  console.log(res.data)
      setMessages(formatted);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // Handle selecting a user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]); // Reset before loading new chat
    fetchMessages(user._id);
  };

  // Socket join & receive
  useEffect(() => {
    if (!user || !selectedUser) return;

    const fromuserId = user._id;
    const targetuserId = selectedUser._id;
    const socket = SocketConnection();

    socket.emit("joinchat", { fromuserId, targetuserId });

    socket.on("messageRecieved", ({ fromuserId, text }) => {
      if (fromuserId === user._id) return;
      setMessages((prev) => [
        ...prev,
        { from: "them", text, createdAt: new Date().toISOString(), senderId: fromuserId },
      ]);
    });

    return () => socket.disconnect();
  }, [user, selectedUser]);

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;

    const fromuserId = user._id;
    const targetuserId = selectedUser._id;
    const socket = SocketConnection();

    socket.emit("sendmessage", { fromuserId, targetuserId, text: input });

    setMessages((prev) => [
      ...prev,
      { from: "me", text: input, createdAt: new Date().toISOString(), senderId: fromuserId },
    ]);

    setInput("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
   if (!Studentdata && !Aluminidata ) return <LoginSelectorPage />;
  return (
    <div className="h-screen w-full flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r overflow-y-auto z-10">
        <div className="p-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
          Connections
        </div>
        {chatlist.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 border-b ${
              selectedUser?._id === user._id ? "bg-gray-200" : ""
            }`}
          >
            {user.fullName || "Unnamed"}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative z-0 overflow-hidden">
        {/* Top Navbar */}
        <div className="relative px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white flex justify-between items-center z-30">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-5xl font-extrabold text-white pointer-events-none select-none">
            Aarambh38
          </div>
          <div className="z-10 text-xl font-extrabold tracking-tight">
            {selectedUser?.fullName || "Select a user"}
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

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 z-10">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.from === "me" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-white text-sm ${
                  msg.from === "me" ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                <div>{msg.text}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {msg.from === "me" ? "You" : selectedUser?.fullName || "Them"} •{" "}
                {moment(msg.createdAt).format("h:mm A")}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex gap-2 z-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
