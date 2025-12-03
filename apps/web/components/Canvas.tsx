import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";
import { IconButton } from "./IconButton";
import { Circle, EllipsisIcon, LineChart, Minus, Pencil, PenIcon, RectangleCircle, RectangleVertical, Square, Text, Type } from "lucide-react";
import { Game } from "../draw/Game";
import { Sun, Moon } from "lucide-react";



type SelectShape = "square" | "rectangle" | "circle" | "line" | "text" | "pencil" | "ellipse";


export default function Canvas({roomId, socket, userId}:{roomId: string, socket: WebSocket, userId:string}){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    const cleanupRef=useRef<(() => void) | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("light");
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
    console.log(`selected theme ${theme}`)
    return(
        <div className={`relative h-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}>

            <div className="h-full w-full bg-white dark:bg-gray-900">
                    <canvas
                        ref={canvasRef}
                        className="bg-white dark:bg-gray-800"
                        width={2000}
                        height={1000}
                    />
            </div>
            <div className="flex">
            <TopBar  selectShape={selectShape} setSelectShape={setSelectShape} theme={theme} setTheme={setTheme}/>

            </div>
        </div>
    )
}

function TopBar({selectShape,setSelectShape, theme, setTheme}:any){
    return(
        <div className="absolute flex w-full justify-center top-0">
            <div className="flex items-center justify-center border rounded-md p-1 mt-2 bg-menu-gray-700">

            
            <IconButton activated={selectShape==="rectangle"} icon={<RectangleVertical size={16} />}  onClick={()=>{setSelectShape("rectangle")}}/>
            {/* <IconButton activated={selectShape==="circle"} icon={<Circle />} onClick={()=>{setSelectShape("circle")}}/> */}

            <IconButton  activated={selectShape==="square"} icon={<Square  size={16}/>} onClick={()=>{setSelectShape("square")}}/>
            <IconButton  activated={selectShape==="line"} icon={<Minus size={16} />} onClick={()=>{setSelectShape("line")}}/>
            <IconButton  activated={selectShape==="pencil"} icon={<PenIcon size={16} />} onClick={()=>{setSelectShape("pencil")}}/>
            <IconButton  activated={selectShape==="ellipse"} icon={<Circle  size={16}/>} onClick={()=>{setSelectShape("ellipse")}}/>


            
            <IconButton  activated={selectShape==="text"} icon={<Type  size={16}/>} onClick={()=>{setSelectShape("text")}}/>

            <IconButton activated={false} icon={theme === 'light'? <Moon />: <Sun />}  onClick={() => {setTheme(theme === "light" ? "dark" : "light")}} />

        </div>

        </div>
    )
}