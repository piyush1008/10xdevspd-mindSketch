import { ReactNode } from "react";

interface IconButton{
    icon: ReactNode,
    onClick: ()=> void
    activated: boolean
}


export function IconButton({icon, onClick, activated}: IconButton){
    return(
        <div className={`pointer rounded-4xl  p-2 m-1  bg-black hover:bg-gray ${activated? "text-red-300": "text-white"} `} onClick={onClick}>   
            {icon}
        </div>

    )
}