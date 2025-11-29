import axios from "axios"
import { BACKEND_URL } from "../app/config"
import { getServerSession } from "next-auth"
import { authOptions } from "../utils/auth"


type Shape={
    type: "rect",
    x:number,
    y: number,
    width: number,
    height: number
}|{
    type: "circle",
    centerX: number,
    centerY: number
    radius: number
}

export async function initDraw(canvas: HTMLCanvasElement,roomId: string, socket: WebSocket, userId: string)
{   

    const ctx=canvas.getContext("2d")

    let existingShapes: Shape[]=await getExisitingShape(roomId)

    if(!ctx)
    {
        return;
    }     

    socket.onmessage=(event)=>{
        const message=JSON.parse(event.data);
        if(message.type === "chat")
        {
            const parseShape=JSON.parse(message.message)
            existingShapes.push(parseShape)
            clearCanvas(existingShapes,canvas, ctx)
        }
    }
    
    clearCanvas(existingShapes,canvas,ctx)


    // ctx.fillStyle="rgba(0,0,0)"
    // ctx.fillRect(0,0,canvas.width,canvas.height)

    // ctx?.fillRect(25, 25, 100, 100);
    // ctx?.clearRect(45, 45, 60, 60);
    // ctx?.strokeRect(50, 50, 100, 100);
    let clicked=false;

    let startX=0;
    let startY=0;


    canvas.addEventListener("mousedown",(e)=>{
        clicked=true;
        startX=e.clientX
        startY=e.clientY
        console.log(e.clientX)
        console.log(e.clientY)
    })

    canvas.addEventListener("mouseup",(e)=>{
        clicked=false;
        const width=e.clientX-startX;
        const height=e.clientY-startY;
        const shape:Shape={
            type:"rect",
            x: startX,
            y: startY,
            height,
            width
        }
        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            user: userId,
            roomId: roomId
        }))

        console.log(e.clientX)
        console.log(e.clientY)
    })

    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            const width=e.clientX-startX;
            const height=e.clientY-startY;
            // console.log(e.clientX)
            // console.log(e.clientY)
            clearCanvas(existingShapes, canvas,ctx)
            ctx.strokeStyle="rgba(255,255,255)"
            ctx.strokeRect(startX,startY,width,height)
        }
    
    })

}


function clearCanvas(existingShapes: Shape[],canvas: HTMLCanvasElement,ctx: CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    existingShapes.map((shape)=>{
        if(shape.type==="rect")
        {
            ctx.strokeStyle="rgba(255,255,255)"
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
    })


}


async function getExisitingShape(roomId:string){
    const res=await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages=res.data.messages;

    const shapes=messages.map((x:{message:string}) =>{
        const messageData=JSON.parse(x.message)
        return messageData;

    })

    return shapes

}