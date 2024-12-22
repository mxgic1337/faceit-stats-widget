import {ReactNode} from "react";

export const InfoBox = ({content, style}: { content: ReactNode, style: 'info' | 'warn' }) => {
  return <div className={`box ${style}`}>
    {content}
  </div>
}