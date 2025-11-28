"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function ChatRoomClient({messages, id}:{
    messages: {message: string}[]
    id: string
}){
    const session=useSession();
    const router=useRouter();
    
    useEffect(() => {
        if(session.status === "unauthenticated") {
            router.push("/");
        }
    }, [session.status, router]);
    
    const {socket, loading}=useSocket(session.data?.accessToken);

    // {"data":{"user":{"id":"8a2fc5fd-c336-4e8c-bf35-0c6833fe3da0","username":"ayush98@gmail.com"},"expires":"2025-12-28T16:55:44.737Z","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YTJmYzVmZC1jMzM2LTRlOGMtYmYzNS0wYzY4MzNmZTNkYTAiLCJpYXQiOjE3NjQzNDg4OTF9.bLegP1us9n37IP0ns2OBru0swspCRT6qEUjknEcQsU8"},"status":"authenticated"}

  
    console.log(`Session on the client component is ${JSON.stringify(session)}`)

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