import axios from "axios"
import { BACKEND_URL } from "../app/config"
import { getExistingShapes } from "./http"
import { SelectShape, Shape } from "./type";




// Store current selectShape for each canvas to avoid closure issues
const canvasSelectShapeMap = new WeakMap<HTMLCanvasElement, { value: SelectShape }>();


export class Game{

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]=[];
    private roomId: string;
    private socket: WebSocket;
    private selectShape: SelectShape;
    private userId: string;

    private clicked:boolean;
    private isCreatingShape: boolean;
    private startX: number;
    private startY: number;
    private currentText:string;
    private typing:boolean;
    constructor(canvas: HTMLCanvasElement,roomId: string,socket: WebSocket, selectShape: SelectShape, userId: string)
    {
        this.canvas=canvas;
        this.ctx=this.canvas.getContext("2d")!;
        this.existingShapes=[];
        this.selectShape=selectShape
        this.roomId=roomId;
        this.socket=socket;
        this.clicked=false;
        this.isCreatingShape=false;
        this.startX=0;
        this.startY=0;
        this.currentText="";
        this.typing=false;
        this.userId=userId;
        this.canvas.tabIndex = 1;  //this is done to focus on canvas to capture keyboard events.
        this.canvas.style.outline = "none";



        this.init();
        this.initHandlers();

        this.initMouseHandler();
    }

    async init(){
        console.log("intializing game")
        this.existingShapes=await getExistingShapes(this.roomId);
        console.log(`existing shape ${this.existingShapes}`)
        this.clearCanvas();
    }

    async initHandlers(){
        this.socket.onmessage=(event)=>{
            const message=JSON.parse(event.data);
            if(message.type==="chat"){
                const shape=JSON.parse(message.message);
                this.existingShapes.push(shape);
                this.clearCanvas()
            }
        }
        // this.clearCanvas();
    }
    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle="rgba(0,0,0)"
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.existingShapes.forEach((shape)=>{
            this.ctx.strokeStyle="rgba(255,255,255)"
            if(shape.type==="rect")
            {
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
            }
            else if(shape.type==="circle")
            {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
            else if(shape.type==="square")
            {
                this.ctx.strokeRect(shape.x, shape.y, shape.size, shape.size)
            }
            else if(shape.type==="line")
            {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x, shape.y);
                this.ctx.lineTo(shape.endx,shape.endy)
                this.ctx.stroke(); 
            }
            else if (shape.type==="text")
            {
                console.log("drawing text")
                this.ctx.font = "20px Arial";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }

            else if (shape.type==="pencil")
            {
                // this.ctx.strokeStyle="rgba(255,255,255)"
                this.ctx.strokeStyle = 'white'; 
                this.ctx.lineWidth = 1; 
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(shape.endx, shape.endy);
                this.ctx.lineTo(shape.x,shape.y); 
                this.ctx.stroke()
            }
            else if(shape.type==="ellipse")
            {
                this.ctx.beginPath();
                this.ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, Math.PI * 2);
                this.ctx.stroke();
            }
    })
   }

    getCanvasCoordinates(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };


   initMouseHandler(){      
    // let clicked=false;
    // let isCreatingShape=false;
    // let startX=0;
    // let startY=0;
    // let currentText="";
    // let typing=false;

        let currentSelectShape = canvasSelectShapeMap.get(this.canvas);
        if (!currentSelectShape) {
            currentSelectShape = { value: this.selectShape };
            canvasSelectShapeMap.set(this.canvas, currentSelectShape);
        } else {
            // Update the existing ref with the new value
            currentSelectShape.value = this.selectShape;
        }

        const handleMouseDown = (e: MouseEvent) => {
            this.clicked=true;
            const coords = this.getCanvasCoordinates(e);
            this.startX = coords.x;
            this.startY = coords.y;
            console.log('Mouse down:', this.startX, this.startY);
            if(this.selectShape==="text")
            {
                this.typing=true;
                this.currentText="";
                this.canvas.focus();   
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!this.clicked || this.isCreatingShape) return;
            this.isCreatingShape = true;
            this.clicked=false;
            const coords = this.getCanvasCoordinates(e);
            const endX = coords.x;
            const endY = coords.y;
            
            // Prevent creating shape if start and end are the same (or very close)
            if (Math.abs(endX - this.startX) < 2 && Math.abs(endY - this.startY) < 2) {
                this.isCreatingShape = false;
                return;
            }
            
            let shape:Shape;
            const shapeType = currentSelectShape.value;
            console.log('Creating shape with selectShape:', shapeType);
            if(shapeType==="rectangle")
            {
                const width=endX-this.startX;
                const height=endY-this.startY;
                shape={
                    type:"rect",
                    x:this.startX,
                    y: this.startY,
                    height,
                    width
                }
            }
            else if(shapeType==="circle")
            {
                const radius=Math.sqrt(Math.pow(endX-this.startX,2)+Math.pow(endY-this.startY,2));
                shape={
                    type:"circle",
                    centerX: this.startX,
                    centerY: this.startY,
                    radius
                }
            }
            else if(shapeType==="square")
            {
                const size=Math.abs(endX-this.startX);
                shape={
                    type:"square",
                    x: this.startX,
                    y: this.startY,
                    size
                }
            }
            else if(shapeType==="line")
            {
                shape={
                    type: "line",
                    x: this.startX,
                    y: this.startY,
                    endx: endX,
                    endy: endY
                }
            }
            // else if(shapeType==="text"){
            //     shape={
            //         type: "text",
            //         x: this.startX,
            //         y: this.startY,
            //         text: ""
            //     }
            // }
            else if(shapeType==="pencil")
            {
                shape={
                    type: "pencil",
                    x: this.startX,
                    y: this.startY,
                    endx: endX,
                    endy: endY
                }
            }
            else if(shapeType==="ellipse")
            {
                const x=(this.startX+ endX)/2;
                const y=(this.startY+ endY)/2;

                const radiusX = Math.abs(endX - this.startX) / 2;
                const radiusY = Math.abs(endY - this.startY) / 2;
                const endAngle=Math.PI * 2

                shape={
                    type:"ellipse",
                    x: x,
                    y:y,
                    radiusX: radiusX,
                    radiusY: radiusY,
                    rotation: 0,
                    startAngle:0,
                    endAngle : endAngle

                }
            }
            else
            {
                // Default to rectangle if shape type is invalid
                const width=endX-this.startX;
                const height=endY-this.startY;
                shape={
                    type:"rect",
                    x: this.startX,
                    y: this.startY,
                    height,
                    width
                }
            }
            console.log('Created shape:', shape)
        
            this.existingShapes.push(shape)

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                user: this.userId,
                roomId: this.roomId
            }))

            this.clearCanvas();
            this.isCreatingShape = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if(this.clicked){
                const coords = this.getCanvasCoordinates(e);
                const endX = coords.x;
                const endY = coords.y;
                const width=endX-this.startX;
                const height=endY-this.startY;
                
                this.clearCanvas()
                const shapeType = currentSelectShape.value;
                console.log(`This  is the shapetype ${shapeType}`)
                if(shapeType==="rectangle")
                {
                    this.ctx.strokeStyle="rgba(255,255,255)"
                    this.ctx.strokeRect(this.startX,this.startY,width,height)
                }
                else if(shapeType==="circle")
                {
                    const radius=Math.sqrt(Math.pow(endX-this.startX,2)+Math.pow(endY-this.startY,2));
                    this.ctx.strokeStyle="rgba(255,255,255)"
                    this.ctx.beginPath();
                    this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                else if(shapeType==="square")
                {
                    const size=Math.abs(width);
                    this.ctx.strokeStyle="rgba(255,255,255)"
                    this.ctx.strokeRect(this.startX, this.startY, size, size)
                }
                else if(shapeType==="line")
                {
                    this.ctx.strokeStyle="rgba(255,255,255)"
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startX, this.startY);
                    this.ctx.lineTo(endX, endY);
                    this.ctx.stroke();
                }
                // else if(shapeType==="text")
                // {
                //     this.ctx.strokeStyle="rgba(255,255,255)"
                //     this.ctx.fillText(shapeType.text, this.startX,this.startY)
                // }
                else if(shapeType==="pencil")
                {
                    this.ctx.strokeStyle = 'white'; 
                    this.ctx.lineWidth = 1; 
                    this.ctx.lineCap = 'round';
                    this.ctx.beginPath();
                    this.ctx.moveTo(endX, endY);
                    this.ctx.lineTo(this.startX, this.startY); 
                    this.ctx.stroke()

                }
                else if(shapeType==="ellipse")
                {
                    console.log("ellipse is getting draw")
                    const x = (this.startX + endX) / 2;
                    const y = (this.startY + endY) / 2;
                
                    const radiusX = Math.abs(endX - this.startX) / 2;
                    const radiusY = Math.abs(endY - this.startY) / 2;
                
                    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                    this.ctx.beginPath();
                    this.ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        };


        const handlekeyDown=(e:KeyboardEvent)=>{
            let typingTimeout: NodeJS.Timeout | null = null;
            const TYPING_DELAY = 800; // 0.8 sec inactivity = finish typing
            console.log("key pressed event listener")
            if(!this.typing)
            {
                return;
            }
            console.log(e)
                // End typing on Enter
            if (e.key === "Enter") {
                this.finishTyping(typingTimeout);
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
                this.currentText = this.currentText.slice(0, -1);
                this.clearCanvas();
                this.drawText(this.currentText, this.startX, this.startY);
                return;
            }
            if (e.key.length !== 1) return;

            // Add typed character
            this.currentText += e.key;
            console.log(this.currentText)
        
            this.clearCanvas();
            this.drawText(this.currentText, this.startX, this.startY);
            if (typingTimeout) clearTimeout(typingTimeout);
            typingTimeout = setTimeout(this.finishTyping, TYPING_DELAY);
        }

        // const handlekeyDown=(e:KeyboardEvent)=>{
        //     let typingTimeout: NodeJS.Timeout | null = null;
        //     const TYPING_DELAY = 800; // 0.8 sec inactivity = finish typing
        //     console.log("key pressed event listener")
        //     if(!typing)
        //     {
        //         return;
        //     }
        //     console.log(e)
        //         // End typing on Enter
        //     if (e.key === "Enter") {
        //         finishTyping(typingTimeout);
        //         return;
        //         //drawText(currentText, startX, startY);
        //         // console.log("ending typing on enter")
        //         // const shape:Shape={
        //         //     type: "text",
        //         //     x: startX, 
        //         //     y: startY,
        //         //     maxwidth: undefined,
        //         //     text: currentText
        //         // }
        //         // console.log(shape)

        //         // existingShapes.push({ ...shape, text: currentText });
        //         // typing = false;
        //         // currentText = "";
        //         // socket.send(JSON.stringify({
        //         //     type: "chat",
        //         //     message: JSON.stringify(shape),
        //         //     user: userId,
        //         //     roomId: roomId
        //         // }))
        
        //         // return;
        //     }

        //     //  // Backspace
        //     if (e.key === "Backspace") {
        //         currentText = currentText.slice(0, -1);
        //         this.clearCanvas();
        //         this.drawText(currentText, startX, startY);
        //         return;
        //     }

        //     // // Handle backspace
        //     // if (e.key === "Backspace") {
        //     //     currentText = currentText.slice(0, -1);
        //     //     redrawCanvas();
        //     //     drawText(currentText, x, y);
        //     //     return;
        //     // }

        //     if (e.key.length !== 1) return;

        //     // Add typed character
        //     currentText += e.key;
        //     console.log(currentText)
        
        //     this.clearCanvas();
        //     this.drawText(currentText, startX, startY);
        //     if (typingTimeout) clearTimeout(typingTimeout);
        //     typingTimeout = setTimeout(finishTyping, TYPING_DELAY);
        // }



            this.canvas.addEventListener("mousedown", handleMouseDown);
            this.canvas.addEventListener("mouseup", handleMouseUp);
            this.canvas.addEventListener("mousemove", handleMouseMove);
            this.canvas.addEventListener("keydown", handlekeyDown);


        // this.canvas.addEventListener("keydown", handlekeyDown);
    }



    finishTyping(typingTimeout: any) {
        if (!this.typing) return;
    
        this.drawText(this.currentText, this.startX, this.startY);
    
        const shape: Shape = {
            type: "text",
            x: this.startX,
            y: this.startY,
            text: this.currentText
        };
    
        this.existingShapes.push(shape);
    
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            user: this.userId,
            roomId: this.roomId
        }));
    
        this.typing = false;
        this.currentText = "";
        typingTimeout = null;
    }


     drawText(text:string, x:number, y:number) {
        if(!this.ctx)
        {
            return;
        }
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, x, y);
    }

}