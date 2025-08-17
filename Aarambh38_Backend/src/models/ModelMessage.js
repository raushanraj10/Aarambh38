// // import mongoose from "mongoose";
// const mongoose=require("mongoose")

// const messageSchema = new mongoose.Schema(
//   {
//     fromuserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Use "Student" or "Alumni" if separate
//       required: true,
//     },
//     targetuserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       default: "",
//     },
//     image: {
//       type: String,
//       default: "",
//     },
//     document: {              
//       type: String,          
//       default: "",           
//     },
//     messageType: {
//       type: String,
//       enum: ["text", "image", "file", "video", "audio"]
//     },
//     repliedmessageType: {
//       type: String,
//       enum: ["text", "image", "file", "video", "audio"]
//     },
//     repliedtext:{
//       type: String,
//       default: "",
//     },
//     repliedById:{
//       type: mongoose.Schema.Types.ObjectId,
//       default:null
//     },
//     repliedToId:{
//       type: mongoose.Schema.Types.ObjectId,
//       default:null
//     },
//     repliedImage:{
//       type: String,
//       default: "",
//     },
//     repliedDocument: {     
//       type: String,        
//       default: "",         
//     },
//     repliedToCreatedAt: {
//   type: Date,
//   default: null,
//    },

//   },
//   { timestamps: true }
// );

// const ModelMessage=mongoose.model("ModelMessage", messageSchema);
// module.exports=ModelMessage


// import mongoose from "mongoose";
const mongoose = require("mongoose");

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
    image: {
      type: String,
      default: "",
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
    },
    repliedmessageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
    },
    repliedtext: {
      type: String,
      default: "",
    },
    repliedById: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    repliedToId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    repliedImage: {
      type: String,
      default: "",
    },
    repliedToCreatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ModelMessage = mongoose.model("ModelMessage", messageSchema);
module.exports = ModelMessage;

