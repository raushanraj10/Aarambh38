const socket=require("socket.io")

const IntializeSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173",
        }
    });
    io.on("connection",(socket)=>{

        socket.on("joinchat",({fromuserId,targetuserId})=>{
            const RoomId=[fromuserId,targetuserId].sort().join("_")
            socket.join(RoomId)
        })

        socket.on("sendmessage",({fromuserId,targetuserId,text})=>{
            const RoomId=[fromuserId,targetuserId].sort().join("_")
            io.to(RoomId).emit("messageRecieved",{fromuserId,text})
        })

        socket.on("disconnect",()=>{})

    })
}
module.exports=IntializeSocket