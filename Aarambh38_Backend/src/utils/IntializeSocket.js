const socket=require("socket.io")
const ModelMessage=require("../models/ModelMessage");
const BASE_URL = require("../constants/ALLURL");
const { cloudinary } = require("./cloudinary");


const IntializeSocket=(server)=>{
 const io=socket(server,{
cors:{
 origin:BASE_URL,
 },
 maxHttpBufferSize: 1e7
 });
 io.on("connection",(socket)=>{
  const path = require("path");

 socket.on("joinchat",({fromuserId,targetuserId})=>{
 const RoomId=[fromuserId,targetuserId].sort().join("_")
socket.join(RoomId)
 })


socket.on("sendmessage", async ({ fromuserId, targetuserId,text="",image = "",document = "",messageType = "text",originalFilename = "",repliedtext,repliedToId,repliedById,repliedImage,repliedDocument,repliedToCreatedAt}) => {
const RoomId = [fromuserId, targetuserId].sort().join("_");
// console.log(" fromuserId  "+fromuserId+" targetuserId  "+targetuserId+" repliedToId  "+repliedToId+" repliedById  "+repliedById)
 try {


 let imageUrl = "";
 let documentUrl = "";

 if (messageType === "image" && image) {
// Upload base64 image to Cloudinary
const result = await cloudinary.uploader.upload(image);
 imageUrl = result.secure_url;
 }

 if (messageType === "document" && document) {
  const extension = path.extname(originalFilename) || ".pdf";
  const publicId = `chat_files/${Date.now()}${extension}`;
  const docResult = await cloudinary.uploader.upload(document, {
    resource_type: "raw",
    public_id: publicId,
  });
  documentUrl = docResult.secure_url;
}



 // Save to MongoDB
 const message = new ModelMessage({
 fromuserId,
targetuserId,
 text,
 image: imageUrl,
 document: documentUrl,
 messageType,
repliedImage,
 repliedtext,
 repliedDocument,
  //  originalFilename,
 repliedById,
repliedToId,
repliedToCreatedAt
 });


await message.save();

io.to(RoomId).emit("messageRecieved", {
  fromuserId,
  targetuserId,
  text,
  image: imageUrl,
  document: documentUrl,
  repliedtext,
  repliedById,
  repliedImage,
  // originalFilename,
  repliedDocument,
  repliedToId,
  repliedToCreatedAt,
  _id: message._id,
  createdAt: message.createdAt,
});



 } catch (error) {
 console.error("Failed to save message:", error);
 socket.emit("messageError", { error: "Message not saved" });
 }
});



socket.on("disconnect",()=>{})


 })
}
module.exports=IntializeSocket