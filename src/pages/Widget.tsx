import '../css/App.scss'
import {Statistic} from "../components/Statistic.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export const themes: {id: string, name: string}[] = [
    {id: "dark", name: "Dark"},
    {id: "compact", name: "Dark Compact"},
    {id: "classic", name: "Classic Dark"},
]

export const Widget = ({preview, overrideUsername}:{preview?: boolean, overrideUsername?: string}) => {
    const [level, setLevel] = useState(1)
    const [diff, setDiff] = useState(0)
    const [elo, setELO] = useState(100)
    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(()=>{
        if (preview) return;

        let theme = searchParams.get("theme") || "dark";
        if (!themes.find(theme1 => theme1.id === theme)) {
            theme = "dark"
        }

        if (searchParams.get("player") === null) {
            navigate('?player=donk666')
            return
        }

        const playerName = searchParams.get("player")
        const getStats = () => {
            fetch(`/stats/${playerName}?format=json&startDate=${searchParams.get("startDate")}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async res => {
                const stats = await res.json() as {level: number, elo: number, diff: number, wins: number, losses: number}
                setLevel(stats.level)
                setELO(stats.elo)
                setDiff(stats.diff)
                setWins(stats.wins)
                setLosses(stats.losses)
            })
        }
        getStats()

        const interval = setInterval(getStats, 1000*60)
        document.getElementsByTagName("html")[0].classList.add(`${theme}-theme`)
        return ()=>{
            clearInterval(interval)
            document.getElementsByTagName("html")[0].classList.remove(`${theme}-theme`)
        }
    })

    return (
        <div className={'wrapper'}>
            <div className={'widget'}>
                <div className={'level'}>
                    <img src={`https://mxgic1337.xyz/fc/faceit${preview ? 10 : level}.svg`} alt={`Level ${preview ? 10 : level}`} />
                    <div className={'elo'}>
                        <h2>{searchParams.get("player") || overrideUsername || "Player"}</h2>
                        <p>{preview ? 2001 : elo} ELO ({0 > diff ? diff : `+${diff}`})</p>
                    </div>
                </div>
                <div className={'matches'}>
                    <div className={'stats'}>
                        <Statistic color={'green'} value={String(wins)} text={'winy'} />
                        <Statistic color={'red'} value={String(losses)} text={'lossy'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
