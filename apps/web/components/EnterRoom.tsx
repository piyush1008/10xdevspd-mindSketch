"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function EnterRoom() {

  const [slug, setSlug]=useState("");
  const router=useRouter();
  return (
    <div>
      <input onChange={(e)=>{
        setSlug(e.target.value)
      }}  type="text" placeholder="Room id" ></input>

      <button onClick={()=>{
        router.push(`/room/${slug}`)
      }}> Join Room</button>
    </div>
  );
}
