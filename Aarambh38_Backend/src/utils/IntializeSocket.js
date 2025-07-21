const socket=require("socket.io")

const IntializeSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:"http:/localhost:5173",
        }
    });
    io.on("connection",(socket)=>{

        socket.on("joinchat",()=>{})

        socket.on("sendmessage",()=>{})

        socket.on("disconnect",()=>{})

    })
}
module.exports=IntializeSocket