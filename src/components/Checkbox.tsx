import {Dispatch} from "react";

export const Checkbox = ({text, state, setState}:{text: string, state: boolean, setState: Dispatch<boolean>}) => {
    return <div className={'checkbox'} onClick={()=>setState(!state)}>
        <div className={`check${state ? ' checked' : ''}`}></div>
        <p>{text}</p>
    </div>
}