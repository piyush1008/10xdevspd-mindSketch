"use client";

import {  ReactNode } from "react";

interface labelProps{
    children?: ReactNode,
    tag: string
    className: string
}

export  function Label({className,children, tag}:labelProps){
    return(
        <label className={className} htmlFor={tag}>
        {children}
      </label>
    )
}