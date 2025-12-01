import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";
import { IconButton } from "./IconButton";
import { Circle, EllipsisIcon, LineChart, Minus, Pencil, PenIcon, RectangleCircle, RectangleVertical, Square, Text } from "lucide-react";
import { Game } from "../draw/Game";


type SelectShape = "square" | "rectangle" | "circle" | "line" | "text" | "pencil" | "ellipse";


export default function Canvas({roomId, socket, userId}:{roomId: string, socket: WebSocket, userId:string}){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    const cleanupRef=useRef<(() => void) | null>(null);
    const [selectShape, setSelectShape]=useState<SelectShape>("rectangle");
    
    // Initialize drawing only once, selectShape updates are handled via WeakMap
    useEffect(()=>{
        // Clean up previous listeners first
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }
        
        if(canvasRef.current && selectShape)
        {
            const g=new Game(canvasRef.current,roomId,socket,selectShape,userId);

            // initDraw(canvasRef.current,roomId,socket, userId,selectShape).then(cleanup => {
            //     cleanupRef.current = cleanup;
            // });
            
            return () => {
                if (cleanupRef.current) {
                    cleanupRef.current();
                    cleanupRef.current = null;
                }
            };
        }
    },[canvasRef, selectShape, roomId, socket, userId])

    return(
        <div className="relative h-screen overflow-hidden">

            <canvas ref={canvasRef} width={2000} height={1000}></canvas>
            <div className="flex">
            <TopBar  selectShape={selectShape} setSelectShape={setSelectShape}/>

            </div>
        </div>
    )
}

function TopBar({selectShape,setSelectShape}:any){
    return(
        <div className="absolute flex  top-0 items-center justify-center">
        <IconButton activated={selectShape==="rectangle"} icon={<RectangleVertical />}  onClick={()=>{setSelectShape("rectangle")}}/>
        {/* <IconButton activated={selectShape==="circle"} icon={<Circle />} onClick={()=>{setSelectShape("circle")}}/> */}

        <IconButton  activated={selectShape==="square"} icon={<Square />} onClick={()=>{setSelectShape("square")}}/>
        <IconButton  activated={selectShape==="line"} icon={<Minus />} onClick={()=>{setSelectShape("line")}}/>
        <IconButton  activated={selectShape==="pencil"} icon={<PenIcon />} onClick={()=>{setSelectShape("pencil")}}/>
        <IconButton  activated={selectShape==="ellipse"} icon={<Circle />} onClick={()=>{setSelectShape("ellipse")}}/>


        
        <IconButton  activated={selectShape==="text"} icon={<Text />} onClick={()=>{setSelectShape("text")}}/>




        </div>
    )
}