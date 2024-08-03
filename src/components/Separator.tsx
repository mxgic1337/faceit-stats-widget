export const Separator = ({text}:{text: string}) => {
    return <div className={'separator'}>
        <p>{text}</p>
        <hr />
    </div>
}