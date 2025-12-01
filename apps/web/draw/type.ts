export type Shape={
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
}|{
    type: "ellipse",
    x: number,
    y: number,
    radiusX: number;
    radiusY: number;
    rotation: number;
    startAngle:number;
    endAngle : number;
}



export type SelectShape = "square" | "rectangle" | "circle" | "line" | "text" | "pencil" | "ellipse";