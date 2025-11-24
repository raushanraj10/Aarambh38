import {io} from "socket.io-client"
import { BASE_URL } from "./AllUrl"

export const SocketConnection=()=>{
    if(location.hostname==="localhost")
        return io(BASE_URL)
    else
        return io("https://aarambh38-1.onrender.com", {
  transports: ["websocket"]
});

}


// import {io} from "socket.io-client"
// import { BASE_URL } from "./AllUrl"

// export const SocketConnection=()=>{
//     if(location.hostname==="localhost")
//         return io(BASE_URL)
//     else
//         return io("http://13.60.166.165",{path:"/api/socket.io"})
// }


// import {io} from "socket.io-client"
// import { BASE_URL } from "./AllUrl"

// export const SocketConnection=()=>{
//     return io(BASE_URL)
// }