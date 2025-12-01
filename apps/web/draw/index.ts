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
}| {
    type: "square",
    x: number,
    y: number,
    size: number
}| {
    type: "line",
    x: number,
    y: number,
    endx:number,
    endy: number
}| {
    type: 'text',
    x: number,
    y: number, 
    maxwidth?: number,
    text: string
}|
{
    type: "pencil",
    x: number,
    y: number,
    endx:number,
    endy: number
}


type SelectShape = "square" | "rectangle" | "circle" | "line" | "text" | "pencil";

// Store current selectShape for each canvas to avoid closure issues
const canvasSelectShapeMap = new WeakMap<HTMLCanvasElement, { value: SelectShape }>();

export async function initDraw(canvas: HTMLCanvasElement,roomId: string, socket: WebSocket, userId: string,selectShape:SelectShape): Promise<() => void>
{   
    console.log(`the selected shape is ${selectShape}`)

    const ctx=canvas.getContext("2d")

    canvas.tabIndex = 1;  //this is done to focus on canvas to capture keyboard events.
    canvas.style.outline = "none";

    let currentText=""
    let typing=false;


    if(!ctx)
    {
        return () => {}; // Return empty cleanup function
    }     

    let existingShapes: Shape[]=await getExisitingShape(roomId)
    
    clearCanvas(existingShapes,canvas,ctx)

    // Get or create the selectShape ref for this canvas
    let currentSelectShape = canvasSelectShapeMap.get(canvas);
    if (!currentSelectShape) {
        currentSelectShape = { value: selectShape };
        canvasSelectShapeMap.set(canvas, currentSelectShape);
    } else {
        // Update the existing ref with the new value
        currentSelectShape.value = selectShape;
    }

    const handleSocketMessage = (event: MessageEvent) => {
        const message=JSON.parse(event.data);
        if(message.type === "chat")
        {
            // Skip if this message is from the current user (already added locally)
            if(message.user === userId)
            {
                return;
            }
            const parseShape=JSON.parse(message.message)
            existingShapes.push(parseShape)
            clearCanvas(existingShapes,canvas, ctx)
        }
    };

    socket.addEventListener("message", handleSocketMessage);


    // ctx.fillStyle="rgba(0,0,0)"
    // ctx.fillRect(0,0,canvas.width,canvas.height)

    // ctx?.fillRect(25, 25, 100, 100);
    // ctx?.clearRect(45, 45, 60, 60);
    // ctx?.strokeRect(50, 50, 100, 100);
    let clicked=false;
    let isCreatingShape=false; // Flag to prevent multiple shape creations

    let startX=0;
    let startY=0;

    // Helper function to get canvas-relative coordinates
    const getCanvasCoordinates = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: MouseEvent) => {
        clicked=true;
        const coords = getCanvasCoordinates(e);
        startX = coords.x;
        startY = coords.y;
        console.log('Mouse down:', startX, startY);
        if(selectShape==="text")
        {
            typing=true;
            currentText="";
            canvas.focus();   
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!clicked || isCreatingShape) return;
        isCreatingShape = true;
        clicked=false;
        const coords = getCanvasCoordinates(e);
        const endX = coords.x;
        const endY = coords.y;
        
        // Prevent creating shape if start and end are the same (or very close)
        if (Math.abs(endX - startX) < 2 && Math.abs(endY - startY) < 2) {
            isCreatingShape = false;
            return;
        }
        
        let shape:Shape;
        const shapeType = currentSelectShape.value;
        console.log('Creating shape with selectShape:', shapeType);
        if(shapeType==="rectangle")
        {
            const width=endX-startX;
            const height=endY-startY;
            shape={
                type:"rect",
                x: startX,
                y: startY,
                height,
                width
            }
        }
        else if(shapeType==="circle")
        {
            const radius=Math.sqrt(Math.pow(endX-startX,2)+Math.pow(endY-startY,2));
            shape={
                type:"circle",
                centerX: startX,
                centerY: startY,
                radius
            }
        }
        else if(shapeType==="square")
        {
            const size=Math.abs(endX-startX);
            shape={
                type:"square",
                x: startX,
                y: startY,
                size
            }
        }
        else if(shapeType==="line")
        {
            shape={
                type: "line",
                x: startX,
                y: startY,
                endx: endX,
                endy: endY
            }
        }
        else if(shapeType==="text"){
            shape={
                type: "text",
                x: startX,
                y: startY,
                text: ""
            }
        }
        else if(shapeType==="pencil")
        {
            shape={
                type: "pencil",
                x: startX,
                y: startY,
                endx: endX,
                endy: endY
            }
        }
        else
        {
            // Default to rectangle if shape type is invalid
            const width=endX-startX;
            const height=endY-startY;
            shape={
                type:"rect",
                x: startX,
                y: startY,
                height,
                width
            }
        }
        console.log('Created shape:', shape)
       
        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            user: userId,
            roomId: roomId
        }))

        clearCanvas(existingShapes, canvas, ctx);
        isCreatingShape = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if(clicked){
            const coords = getCanvasCoordinates(e);
            const endX = coords.x;
            const endY = coords.y;
            const width=endX-startX;
            const height=endY-startY;
            
            clearCanvas(existingShapes, canvas,ctx)
            const shapeType = currentSelectShape.value;
            if(shapeType==="rectangle")
            {
                ctx.strokeStyle="rgba(255,255,255)"
                ctx.strokeRect(startX,startY,width,height)
            }
            else if(shapeType==="circle")
            {
                const radius=Math.sqrt(Math.pow(endX-startX,2)+Math.pow(endY-startY,2));
                ctx.strokeStyle="rgba(255,255,255)"
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            else if(shapeType==="square")
            {
                const size=Math.abs(width);
                ctx.strokeStyle="rgba(255,255,255)"
                ctx.strokeRect(startX, startY, size, size)
            }
            else if(shapeType==="line")
            {
                ctx.strokeStyle="rgba(255,255,255)"
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            // else if(shapeType==="text")
            // {
            //     ctx.strokeStyle="rgba(255,255,255)"
            //     ctx.fillText(shapeType.text, startX,startY)
            // }
            else if(shapeType==="pencil")
            {
                ctx.strokeStyle = 'white'; 
                ctx.lineWidth = 1; 
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(endX, endY);
                ctx.lineTo(startX, startY); 
                ctx.stroke()

            }
        }
    };


    function drawText(text:string, x:number, y:number) {
        if(!ctx)
        {
            return;
        }
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    }

    function finishTyping(typingTimeout: any) {
        if (!typing) return;
    
        drawText(currentText, startX, startY);
    
        const shape: Shape = {
            type: "text",
            x: startX,
            y: startY,
            text: currentText
        };
    
        existingShapes.push(shape);
    
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            user: userId,
            roomId: roomId
        }));
    
        typing = false;
        currentText = "";
        typingTimeout = null;
    }
    

    const handlekeyDown=(e:KeyboardEvent)=>{
        let typingTimeout: NodeJS.Timeout | null = null;
        const TYPING_DELAY = 800; // 0.8 sec inactivity = finish typing
        console.log("key pressed event listener")
        if(!typing)
        {
            return;
        }
        console.log(e)
            // End typing on Enter
        if (e.key === "Enter") {
            finishTyping(typingTimeout);
            return;
            //drawText(currentText, startX, startY);
            // console.log("ending typing on enter")
            // const shape:Shape={
            //     type: "text",
            //     x: startX, 
            //     y: startY,
            //     maxwidth: undefined,
            //     text: currentText
            // }
            // console.log(shape)

            // existingShapes.push({ ...shape, text: currentText });
            // typing = false;
            // currentText = "";
            // socket.send(JSON.stringify({
            //     type: "chat",
            //     message: JSON.stringify(shape),
            //     user: userId,
            //     roomId: roomId
            // }))
    
            // return;
        }

        //  // Backspace
        if (e.key === "Backspace") {
            currentText = currentText.slice(0, -1);
            clearCanvas(existingShapes, canvas, ctx);
            drawText(currentText, startX, startY);
            return;
        }

        // // Handle backspace
        // if (e.key === "Backspace") {
        //     currentText = currentText.slice(0, -1);
        //     redrawCanvas();
        //     drawText(currentText, x, y);
        //     return;
        // }

        if (e.key.length !== 1) return;

        // Add typed character
        currentText += e.key;
        console.log(currentText)
    
        clearCanvas(existingShapes, canvas, ctx);
        drawText(currentText, startX, startY);
        if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(finishTyping, TYPING_DELAY);
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    canvas.addEventListener("keydown", handlekeyDown);


    // Return cleanup function
    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("keydown", handlekeyDown);

        socket.removeEventListener("message", handleSocketMessage);
    };

}


function clearCanvas(existingShapes: Shape[],canvas: HTMLCanvasElement,ctx: CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    existingShapes.forEach((shape)=>{
        ctx.strokeStyle="rgba(255,255,255)"
        if(shape.type==="rect")
        {
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
        else if(shape.type==="circle")
        {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if(shape.type==="square")
        {
            ctx.strokeRect(shape.x, shape.y, shape.size, shape.size)
        }
        else if(shape.type==="line")
        {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.endx,shape.endy)
            ctx.stroke(); 
        }
        else if (shape.type==="text")
        {
            console.log("drawing text")
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(shape.text, shape.x, shape.y);
        }

        else if (shape.type==="pencil")
        {
            // ctx.strokeStyle="rgba(255,255,255)"
            ctx.strokeStyle = 'white'; 
            ctx.lineWidth = 1; 
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(shape.endx, shape.endy);
            ctx.lineTo(shape.x,shape.y); 
            ctx.stroke()
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