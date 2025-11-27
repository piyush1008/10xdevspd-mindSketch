import { prismaclient } from "@repo/db/prismaClient";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import ChatRoom from "../../../components/ChatRoom";

// async function getRoom(slug:string)
// {
//     try {
//         const room=await prismaclient.room.findFirst({
//             where:{
//                 slug:slug
//             }
//         })
//         return room?.id
//     } catch (error) {
//         console.log(error);
//     }
// }


async function getRoomId(slug:string)
{
    try {
        const response=await axios.get(`${BACKEND_URL}/room/${slug}`);
        return response.data.room.id;
    } catch (error) {
        console.log(error);
    }
}


export default async function ChatRoom1({
    params
}:any)
{
    const slug=(await params).slug;
    console.log(slug)
    
    const roomId=await getRoomId(slug);
    console.log(roomId)
    return(
        <div>
           <ChatRoom id={roomId}/>
        </div>
    )
}