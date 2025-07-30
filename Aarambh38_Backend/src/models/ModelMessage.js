// import mongoose from "mongoose";
const mongoose=require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    fromuserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Use "Student" or "Alumni" if separate
      required: true,
    },
    targetuserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
      default: "text",
    },
    repliedmessageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
      default: "text",
    },
    repliedtext:{
      type: String,
      default: "",
    },
    repliedById:{
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const ModelMessage=mongoose.model("ModelMessage", messageSchema);
module.exports=ModelMessage
