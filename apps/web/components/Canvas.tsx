import { useEffect, useRef } from "react";
import { initDraw } from "../draw";



export default function Canvas({roomId, socket, userId}:{roomId: string, socket: WebSocket, userId:string}){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        
        if(canvasRef.current)
        {
           
            
            initDraw(canvasRef.current,roomId,socket, userId)
            
           

        }
    },[canvasRef])

    return(
        <div>
            <canvas ref={canvasRef} width={2000} height={1000}></canvas>
            <div>
                <button> Rectangle</button>
                <button> Circle</button>
            </div>
        </div>
    )
}