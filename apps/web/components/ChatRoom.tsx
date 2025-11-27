import axios from "axios"
import { BACKEND_URL } from "../app/config"
import ChatRoomClient from "./ChatRoomClient";

async function getCharts(roomId: string)
{
    const response=await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    return response.data.messages;
}

export default async  function ChatRoom({id}:any){
    const messages=await getCharts(id)
    return(
        <div>
            <ChatRoomClient messages={messages} id={id} />
        </div>
    )
}