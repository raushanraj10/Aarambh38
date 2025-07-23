const socket=require("socket.io")
const ModelMessage=require("../models/ModelMessage");
const BASE_URL = require("../constants/ALLURL");

const IntializeSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:BASE_URL,
        }
    });
    io.on("connection",(socket)=>{

        socket.on("joinchat",({fromuserId,targetuserId})=>{
            const RoomId=[fromuserId,targetuserId].sort().join("_")
            socket.join(RoomId)
        })

    socket.on("sendmessage", async ({ fromuserId, targetuserId, text }) => {
  const RoomId = [fromuserId, targetuserId].sort().join("_");

  try {
    // Save to MongoDB
    const message = new ModelMessage({
      fromuserId,
      targetuserId,
      text,
      messageType: "text", // support for future media types
    });

    await message.save();

    // Emit to both users
    io.to(RoomId).emit("messageRecieved", {
      fromuserId,
      targetuserId,
      text,
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