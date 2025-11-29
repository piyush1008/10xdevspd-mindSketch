"use client";

interface formInputProps{
    id: string
    type: string
    placeholder: string
    className: string
    onChange?: ()=> void 
}

export function FormInput({id,type,placeholder,className, onChange}:formInputProps){
    return(
        <input
        id="email"
        type="email"
        placeholder="you@studio.com"
        className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus-visible:outline-none"
      />
    )
}