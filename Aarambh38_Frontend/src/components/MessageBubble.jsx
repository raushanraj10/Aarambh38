// components/MessageBubble.jsx
import { useState } from "react";
import moment from "moment";

const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageBubble = ({
  msg,
  isMe,
  sender,
  onReply,
  onReact
}) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`relative group flex items-end gap-2 ${
        isMe ? "justify-end" : "justify-start"
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        onReply(msg);
      }}
    >
      {!isMe && (
        <img
          src={sender?.photourl || "/default-avatar.png"}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border"
        />
      )}

      <div className="flex flex-col max-w-[80%] sm:max-w-xs">
        {msg.repliedtext && (
          <div
            className={`text-xs text-gray-700 px-3 py-1 rounded-t-md rounded-br-md mb-1 border-l-4 ${
              isMe ? "border-green-400 bg-green-100" : "border-blue-400 bg-blue-100"
            }`}
          >
            {msg.repliedtext}
          </div>
        )}

        <div
          className={`px-4 py-2 break-words rounded-lg shadow text-white text-sm relative ${
            isMe ? "bg-green-600 self-end" : "bg-blue-600"
          }`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {msg.text}

          {/* Reactions */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className="mt-1 flex gap-1">
              {msg.reactions.map((emoji, i) => (
                <span key={i} className="text-sm">{emoji}</span>
              ))}
            </div>
          )}

          {/* Hover emoji options */}
          {showReactions && (
            <div className="absolute -top-8 right-0 bg-white border shadow rounded-full px-2 py-1 flex gap-1 z-50">
              {emojis.map((emoji, i) => (
                <span
                  key={i}
                  className="cursor-pointer"
                  onClick={() => onReact(msg._id, emoji)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
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
};

export default MessageBubble;
