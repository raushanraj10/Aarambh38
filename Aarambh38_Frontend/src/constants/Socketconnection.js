import {io} from "socket.io-client"
import { BASE_URL } from "./AllUrl"

export const SocketConnection=()=>{
    if(location.hostname==="localhost")
        return io(BASE_URL)
    else
        return io("https://13.60.252.38",{path:"api/socket.io"})
}