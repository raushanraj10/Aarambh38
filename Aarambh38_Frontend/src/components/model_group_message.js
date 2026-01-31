const mongoose = require("mongoose");

const GroupMessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    senderId: { type: mongoose.Schema.Types.ObjectId },
    text: String,
    image: String,
    document: String,
    messageType: { type: String, default: "text" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);
