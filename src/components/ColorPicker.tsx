import {Dispatch} from "react";

export const ColorPicker = ({text, color, setColor}:{text: string, color: string, setColor: Dispatch<string>}) => {
    return <div className={'color-picker'}>
        <p>{text}</p>
        <input type={'color'} onChange={(e) => setColor(e.target.value)} value={color} />
    </div>
}