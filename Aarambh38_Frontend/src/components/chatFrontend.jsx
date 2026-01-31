import { useState, useEffect, useRef } from "react";
import { Menu, MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import moment from "moment";
import LoginSelectorPage from "../LoginSelectorPage";
import { BASE_URL } from "../constants/AllUrl";
import Shimmer from "../Shimmer";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ChatApp = () => {
  const StudentData = useSelector((s) => s.studentdata);
  const AlumniData = useSelector((s) => s.aluminidata);
  const user = StudentData || AlumniData;
  const Navigate = useNavigate();

  /* ================= BULK STATES ================= */
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  /* ================= EXISTING STATES ================= */
  const [chatlist, setChatlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!StudentData && !AlumniData) {
      Navigate("/loginselectorpage");
    }
  }, [StudentData, AlumniData]);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      const url = StudentData
        ? `${BASE_URL}/mymentors`
        : `${BASE_URL}/getalumnimentees`;

      const res = await axios.get(url, { withCredentials: true });
      setChatlist(res.data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  /* ================= SOCKET INIT ================= */
  useEffect(() => {
    socketRef.current = SocketConnection();

    socketRef.current.on("messageRecieved", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  /* ================= JOIN CHAT ================= */
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      socketRef.current.emit("joinchat", {
        fromuserId: user._id,
        targetuserId: selectedUser._id,
      });
    }
  }, [selectedUser]);

  /* ================= 1-TO-1 SEND ================= */
  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;

    const messageId = uuidv4();

    socketRef.current.emit("sendmessage", {
      fromuserId: user._id,
      targetuserId: selectedUser._id,
      text: input,
      messageId,
    });

    setMessages((prev) => [
      ...prev,
      {
        fromuserId: user._id,
        targetuserId: selectedUser._id,
        text: input,
        createdAt: new Date(),
        messageId,
      },
    ]);

    setInput("");
  };

  /* ================= BULK SEND ================= */
  const handleBulkSend = () => {
    if (!input.trim()) return;
    if (selectedStudents.length === 0) {
      alert("Select at least one student");
      return;
    }

    socketRef.current.emit("alumniBulkMessage", {
      fromuserId: user._id,
      studentIds: selectedStudents,
      text: input,
    });

    setInput("");
    setSelectedStudents([]);
    setBulkMode(false);
    alert("Message sent to selected students");
  };

  if (loading) return <Shimmer />;
  if (!user) return <LoginSelectorPage />;

  return (
    <div className="h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <div className="p-4 font-bold">Connections</div>

        {chatlist.map((u) => (
          <div
            key={u._id}
            className={`flex items-center gap-3 px-4 py-3 border-b
              ${selectedUser?._id === u._id ? "bg-gray-200" : ""}
              ${bulkMode ? "cursor-default" : "cursor-pointer hover:bg-gray-100"}
            `}
            onClick={() => !bulkMode && setSelectedUser(u)}
          >
            {AlumniData && bulkMode && (
              <input
                type="checkbox"
                checked={selectedStudents.includes(u._id)}
                onChange={() =>
                  setSelectedStudents((prev) =>
                    prev.includes(u._id)
                      ? prev.filter((id) => id !== u._id)
                      : [...prev, u._id]
                  )
                }
              />
            )}

            <img
              src={u.photourl || "/default-avatar.png"}
              className="w-10 h-10 rounded-full"
            />
            <span>{u.fullName}</span>
          </div>
        ))}
      </div>

      {/* ================= CHAT ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-4 bg-blue-600 text-white flex justify-between">
          <span>
            {bulkMode
              ? `Bulk Message (${selectedStudents.length})`
              : selectedUser?.fullName || "Select a user"}
          </span>

          {AlumniData && (
            <button
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedStudents([]);
                setSelectedUser(null);
                setMessages([]);
              }}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              {bulkMode ? "Exit Bulk" : "Bulk Message"}
            </button>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto">
          {!bulkMode &&
            messages.map((m) => (
              <div
                key={m.messageId}
                className={`mb-2 ${
                  m.fromuserId === user._id ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded">
                  {m.text}
                </span>
                <div className="text-xs text-gray-500">
                  {moment(m.createdAt).format("h:mm A")}
                </div>
              </div>
            ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white flex gap-2 border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              bulkMode ? "Message to selected students" : "Type a message"
            }
            className="flex-1 border px-3 py-2 rounded"
            disabled={!selectedUser && !bulkMode}
          />

          <button
            onClick={() => (bulkMode ? handleBulkSend() : handleSend())}
            className="bg-green-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
