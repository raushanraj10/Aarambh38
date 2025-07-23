import {io} from "socket.io-client"
import { BASE_URL } from "./AllUrl"

export const SocketConnection=()=>{
    return io(BASE_URL)
}