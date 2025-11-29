"use client"
import { useEffect, useRef, useState } from "react"
import { initDraw } from "../draw";
import { useSocket } from "../hooks/useSocket";
import { WS_URL } from "../app/config";
import Canvas from "./Canvas";
import { useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

export function RoomCanvas({roomId}:{roomId: string}){
 

    const [socket, setSocket]=useState<WebSocket>();
    const session=useSession();
    const token=session.data?.accessToken
    console.log(JSON.stringify(token))

    useEffect(()=>{
        if (!token) {
            return;
        }

        const ws=new WebSocket(`${WS_URL}/?token=${token}`)
        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    },[token, roomId])


    

    if(!socket)
    {
        return <div>
            Connecting to server....
        </div>
    }


    return(
        // <div className="w-screen h-screen bg-red-500">
        //     Hii there
        // </div>
        <div>
            <Canvas roomId={roomId} socket={socket} userId={session?.data?.user.id || ""}/>
           
        </div>
    )
}