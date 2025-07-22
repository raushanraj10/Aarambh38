import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import { useParams } from "react-router-dom";

const ChatApp = () => {
  const { touserId } = useParams();
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const Admindata = useSelector((store) => store.admindata);

  const [chatlist, setChatlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fetch mentors for students
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/mymentors", {
          withCredentials: true,
        });
        setChatlist(res.data);
      } catch (error) {
        console.error("Failed to load mentors", error);
      }
    };

    if (Studentdata) fetchMentors();
  }, [Studentdata]);

  // Fetch mentees for alumni
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getalumnimentees", {
          withCredentials: true,
        });
        setChatlist(res.data);
      } catch (err) {
        console.error("Failed to fetch mentees", err);
      }
    };

    if (Aluminidata) fetchMentees();
  }, [Aluminidata]);

  // Socket connection and listener
  useEffect(() => {
    const fromuserId = Studentdata?._id || Aluminidata?._id;
    const targetuserId = selectedUser ? selectedUser._id : touserId;

    const socket = SocketConnection();

    socket.emit("joinchat", { fromuserId, targetuserId });

    socket.on("messageRecieved", ({ fromuserId, text }) => {
      console.log(text)
      const myId = Studentdata?._id || Aluminidata?._id;
      if (fromuserId === myId) return; // ignore self-message
      setMessages((prev) => [...prev, { from: "them", text }]);
    });

    return () => socket.disconnect();
  }, [Studentdata, Aluminidata, selectedUser, touserId]);

  const handleSend = () => {
    if (!input.trim()) return;
    const fromuserId = Studentdata?._id || Aluminidata?._id;
    const targetuserId = selectedUser ? selectedUser._id : touserId;

    const socket = SocketConnection();
    socket.emit("sendmessage", { fromuserId, targetuserId, text: input });

    setMessages((prev) => [...prev, { from: "me", text: input }]);
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
            onClick={() => {
              setSelectedUser(user);
              setMessages([]); // Clear previous messages on new user select
            }}
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
          {/* Faded Background Text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-5xl font-extrabold text-white pointer-events-none select-none">
            Aarambh38
          </div>

          {/* Foreground Username */}
          <div className="z-10 text-xl font-extrabold tracking-tight">
            {selectedUser?.fullName || "Select a user"}
          </div>

          {/* Dropdown Menu Button */}
          <div className="relative z-50" ref={menuRef}>
            <MoreVertical
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black border rounded-md shadow-xl z-50 py-1">
                <ul className="text-sm">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Block
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Report
                  </li>
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
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-white text-sm ${
                msg.from === "me" ? "bg-green-600 ml-auto" : "bg-blue-600"
              }`}
            >
              {msg.text}
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
