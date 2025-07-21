import {io} from "socket.io-client"

export const SocketConnection=()=>{
    return io("http://localhost:5000")
}