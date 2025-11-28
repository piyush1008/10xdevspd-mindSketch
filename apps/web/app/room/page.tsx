"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function CreateRoom(){
    const [slug, setSlug]=useState("");
    const router=useRouter();
    return(
        <div className="max-w h-screen flex justify-center items-center">
            <div>
                <input onChange={(e)=>{
                    setSlug(e.target.value)
                }} type="text" placeholder="Enter the room" />
                <button onClick={()=>{
                    router.push(`/room/${slug}`)
                }}>JoinRoom</button>
            </div>
        </div>
    )
}