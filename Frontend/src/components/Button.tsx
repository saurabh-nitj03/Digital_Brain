import type { ReactElement } from "react"

export interface ButtonProps{
    variant:"primary" | "secondary",
    size:"sm" | 'md' | 'lg',
    text:string,
    startIcon?:ReactElement,
    endIcon?:ReactElement, 
    onClick?:()=>void,
    width?:boolean,
    rounded?:boolean,
    type?:"submit" | "reset" | "button"
}

const variantStyles={
   "primary": "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out",
    "secondary": "bg-purple-100 text-purple-600 border border-purple-300 hover:bg-purple-200 hover:border-purple-400 hover:text-purple-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out"
}


const sizeStyles={
    "sm":"py-1 px-2 text-sm",
    "md":"py-2 px-4 text-md ",
    "lg":"py-4 px-6 text-xl rounded-2xl"
}

const defaultStyles=" flex items-center justify-center "

export const Button=(props:ButtonProps)=>{
    return <button type={props.type} onClick={props.onClick} className={`${variantStyles[props.variant]} ${sizeStyles[props.size]}  ${defaultStyles} ${props.width ? `w-full` : ''} ${!props.rounded ? `rounded-md` : ''}`} >

          {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon}
        
    </button>
}
