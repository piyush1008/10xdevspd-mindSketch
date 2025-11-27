"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";


export default function ChatRoomClient({messages, id}:{
    messages: {message: string}[]
    id: string
}){
    const {socket, loading}=useSocket();

    const [chats, setChats]=useState(messages);
    const [currentMessage, setCurrentMessage]=useState("");

    useEffect(()=>{
        if(socket && !loading)
        {

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage=(event)=>{
                const parseData=JSON.parse(event.data);
                if(parseData.type="chat")
                {
                    // if(parseData.id===id)//checking if the message belong to the same chat
                    // {
                    //     setChats(c=> [...c,parseData.message])

                    // }

                    setChats(c=> [...c,parseData.message])
                }
            }
        }

        return ()=>{
            socket?.close()
        }
    },[socket, loading, id])

    return (
        <div>
            {chats.map((m)=>{
                return(<div>
                    {m.message}
                </div>
            )})}

            <input onChange={(e)=>{
                setCurrentMessage(e.target.value)
            }} type="text" placeholder="Type the message" />
            <button onClick={()=>{
                socket?.send(JSON.stringify({
                    type: "chat",
                    roomId: Number(id),
                    message: currentMessage
                }))
                setCurrentMessage("")
            }}>Send message</button>
        </div>
    )
}