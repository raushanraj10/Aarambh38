// ======================= IMPORTS =======================
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Menu, Paperclip, Camera, FileText } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SocketConnection } from "../constants/Socketconnection";
import moment from "moment";
import LoginSelectorPage from "../LoginSelectorPage";
import { BASE_URL } from "../constants/AllUrl";
import Shimmer from "../Shimmer";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// ======================= COMPONENT =======================
const ChatApp = () => {
  // ---------- AUTH ----------
  const StudentData = useSelector((store) => store.studentdata);
  const AlumniData = useSelector((store) => store.aluminidata);
  const user = StudentData || AlumniData;
  const Navigate = useNavigate();

  // ---------- GROUP STATE (NEW) ----------
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [chatType, setChatType] = useState("private"); // private | group

  // ---------- CHAT STATE ----------
  const [chatlist, setChatlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);

  // ---------- SOCKET ----------
  const socketRef = useRef(null);

  // ---------- UI ----------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  // ---------- FILE / IMAGE ----------
  const [imagePreview, setImagePreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [originalDocName, setOriginalDocName] = useState("");

  // ---------- REFS ----------
  const bottomRef = useRef(null);

  // ======================= AUTH GUARD =======================
  useEffect(() => {
    if (!StudentData && !AlumniData) Navigate("/loginselectorpage");
  }, [StudentData, AlumniData]);

  // ======================= FETCH USERS =======================
  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const endpoint = StudentData
          ? `${BASE_URL}/mymentors`
          : `${BASE_URL}/getalumnimentees`;

        const res = await axios.get(endpoint, { withCredentials: true });
        setChatlist(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // ======================= FETCH GROUPS (NEW) =======================
  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/mygroups`, {
          withCredentials: true,
        });
        setGroups(res.data || []);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };

    fetchGroups();
  }, [user]);

  // ======================= SOCKET CONNECT =======================
  useEffect(() => {
    if (!user || !selectedUser) return;

    socketRef.current = SocketConnection();

    socketRef.current.on("messageRecieved", (msg) => {
      if (
        (msg.fromuserId === selectedUser._id &&
          msg.targetuserId === user._id) ||
        (msg.fromuserId === user._id &&
          msg.targetuserId === selectedUser._id)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            from: msg.fromuserId === user._id ? "me" : "them",
          },
        ]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?._id, selectedUser?._id]);

  // ======================= JOIN PRIVATE CHAT =======================
  useEffect(() => {
    if (!socketRef.current || chatType !== "private" || !selectedUser) return;

    socketRef.current.emit("joinchat", {
      fromuserId: user._id,
      targetuserId: selectedUser._id,
    });
  }, [selectedUser, chatType]);

  // ======================= FETCH MESSAGES =======================
  const fetchMessages = async (id) => {
    setMessageLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getmessageswith/${id}`, {
        withCredentials: true,
      });

      setMessages(
        res.data.map((msg) => ({
          ...msg,
          from: msg.fromuserId === user._id ? "me" : "them",
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setMessageLoading(false);
    }
  };

  // ======================= USER SELECT =======================
  const handleSelectUser = async (u) => {
    setChatType("private");
    setSelectedGroup(null);
    setSelectedUser(u);
    setMessages([]);
    fetchMessages(u._id);
    setSidebarOpen(false);
  };

  // ======================= SEND MESSAGE =======================
  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    const payload = {
      fromuserId: user._id,
      targetuserId: selectedUser._id,
      text: input,
      messageId: uuidv4(),
    };

    socketRef.current.emit("sendmessage", payload);

    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        from: "me",
        createdAt: new Date().toISOString(),
      },
    ]);

    setInput("");
  };

  // ======================= RENDER =======================
  if (!StudentData && !AlumniData) return <LoginSelectorPage />;
  if (loading) return <Shimmer />;

  const filteredUsers = chatlist.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex">
      {/* ======================= SIDEBAR ======================= */}
      <div className={`w-64 bg-white border-r overflow-y-auto`}>
        <div className="p-4 font-bold">Connections</div>

        <input
          className="mx-4 mb-2 px-2 py-1 border rounded w-[90%]"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ===== GROUPS ===== */}
        {groups.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs text-gray-500 font-bold">
              GROUPS
            </div>
            {groups.map((g) => (
              <div
                key={g._id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedGroup?._id === g._id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setChatType("group");
                  setSelectedGroup(g);
                  setSelectedUser(null);
                  setMessages([]);
                }}
              >
                {g.groupName}
              </div>
            ))}
          </>
        )}

        {/* ===== USERS ===== */}
        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedUser?._id === u._id ? "bg-gray-200" : ""
            }`}
            onClick={() => handleSelectUser(u)}
          >
            {u.fullName}
          </div>
        ))}
      </div>

      {/* ======================= CHAT AREA ======================= */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 font-semibold">
          {chatType === "private"
            ? selectedUser?.fullName || "Select a user"
            : selectedGroup?.groupName || "Select a group"}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m) => (
            <div
              key={m.messageId}
              className={`max-w-xs px-3 py-2 rounded text-white ${
                m.from === "me" ? "bg-green-600 ml-auto" : "bg-blue-600"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {chatType === "private" && (
          <div className="p-4 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type message..."
            />
            <button
              className="bg-blue-600 text-white px-4 rounded"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
