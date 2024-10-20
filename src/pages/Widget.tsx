import '../css/App.scss'
import {Statistic} from "../components/Statistic.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Language, languages, tl} from "../translations/translations.ts";
import {findPlayerByUsername} from "../utils/faceit_util.ts";

export const themes: { id: string, name: string }[] = [
    {id: "dark", name: "Dark"},
    {id: "compact", name: "Dark Compact"},
    {id: "classic", name: "Classic Dark"},
    {id: "normal-custom", name: "Custom"},
    {id: "compact-custom", name: "Custom Compact"},
    {id: "custom", name: "Custom CSS"},
]

interface Props {
    preview?: boolean,
    overrideUsername?: string,
    overrideTheme?: string,
    overrideBorder1?: string,
    overrideBorder2?: string,
    overrideTextColor?: string,
    overrideBackground?: string,
    overrideCustomCSS?: string,
    overrideLanguage?: string,
    overrideShowAverage?: boolean,
    overrideShowEloDiff?: boolean,
    overrideShowEloSuffix?: boolean,
    overrideShowEloProgressBar?: boolean,
}

export const Widget = ({preview, overrideUsername, overrideTheme, overrideBorder1, overrideBorder2, overrideTextColor, overrideBackground, overrideCustomCSS, overrideLanguage, overrideShowAverage, overrideShowEloDiff, overrideShowEloSuffix, overrideShowEloProgressBar}: Props) => {
    const [level, setLevel] = useState(1)
    const [language, setLanguage] = useState<Language>(languages[0])
    const [startingElo, setStartingElo] = useState<number>(100)
    const [elo, setElo] = useState(100)
    const [kills, setKills] = useState(0)
    const [deaths, setDeaths] = useState(0)
    const [hsPercent, setHSPercent] = useState(0)
    const [avgMatches, setAvgMatches] = useState(0)
    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)

    const [customColorScheme, setCustomColorScheme] = useState<boolean>()
    const [customColor, setCustomColor] = useState<string>()
    const [customBackgroundColor, setCustomBackgroundColor] = useState<string>()
    const [customBorderColor, setCustomBorderColor] = useState<string>()
    const [customBorderColor2, setCustomBorderColor2] = useState<string>()

    useEffect(() => {
        if (['normal-custom', 'compact-custom'].includes((overrideTheme || searchParams.get('theme') || 'dark'))) {
            setCustomColorScheme(true)
            if (preview) {
                setCustomColor(overrideTextColor)
                setCustomBackgroundColor(overrideBackground)
                setCustomBorderColor(overrideBorder1)
                setCustomBorderColor2(overrideBorder2)
            }else{
                setCustomColor(`#${searchParams.get('color')}`)
                setCustomBackgroundColor(`#${searchParams.get('bg-color')}`)
                setCustomBorderColor(`#${searchParams.get('border1')}`)
                setCustomBorderColor2(`#${searchParams.get('border2')}`)
            }
        }else{
            setCustomColorScheme(false)
        }
    }, [overrideTheme, overrideTextColor, overrideBackground, overrideBorder1, overrideBorder2]);

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const language = languages.find(language => language.id === searchParams.get("lang"));
        if (language) setLanguage(language);
    }, [overrideLanguage, searchParams]);

    useEffect(() => {
        if (preview) return;
        const startDate = new Date();

        let theme = searchParams.get("theme") || "dark";
        if (!themes.find(theme1 => theme1.id === theme)) {
            theme = "dark"
        }

        if (searchParams.get("player") === null) {
            navigate('?player=donk666')
            return
        }

        let playerName = searchParams.get("player");
        if (playerName === null) playerName = 'donk666';

        const getStats = (firstTime?: boolean) => {
            findPlayerByUsername(playerName, startDate).then((player) => {
                if (!player) return;
                if (!player || !player.elo || !player.level) return;
                if (firstTime) setStartingElo(player.elo)

                setElo(player.elo)
                setLevel(player.level)

                setWins(player.wins)
                setLosses(player.losses)

                setKills(player.avg.kills)
                setDeaths(player.avg.deaths)
                setHSPercent(player.avg.hspercent)
                setAvgMatches(player.avg.matches)
            })
        }
        getStats(true)
        const interval =
            setInterval(getStats, 1000 * 60)
        document.getElementsByTagName("html")[0].classList.add(`${theme}-theme`)

        return () => {
            clearInterval(interval)
            document.getElementsByTagName("html")[0].classList.remove(`${theme}-theme`)
        }
    }, [])

    useEffect(() => {
        if (!searchParams.get("theme") && !overrideTheme) return
        if ((overrideTheme || searchParams.get("theme")) !== "custom") return

        const cssPath = overrideCustomCSS || searchParams.get("css") || undefined
        if (!cssPath) return;

        const head = document.head;
        const link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = cssPath;

        head.appendChild(link);
        return () => {
            head.removeChild(link);
        }

    }, [overrideCustomCSS, overrideTheme])

    const eloDistribution = [
        ['#eee', 100, 500],
        ['#1CE400', 501, 750],
        ['#1CE400', 751, 900],
        ['#FFC800', 901, 1050],
        ['#FFC800', 1051, 1200],
        ['#FFC800', 1201, 1350],
        ['#FFC800', 1351, 1530],
        ['#FF6309', 1531, 1750],
        ['#FF6309', 1750, 2000],
        ['#FE1F00', 2001],
    ]

    return (
        <>
            {customColorScheme && <style>{`
                .${overrideTheme || searchParams.get('theme') as string}-theme * {
                    color: ${customColor} !important;
                }
                .${overrideTheme || searchParams.get('theme') as string}-theme .wrapper {
                    background: linear-gradient(0, ${customBorderColor}, ${customBorderColor2})
                }
                .${overrideTheme || searchParams.get('theme') as string}-theme .wrapper .widget {
                    background: ${customBackgroundColor}
                }
                .${overrideTheme || searchParams.get('theme') as string}-theme .wrapper .average .stat {
                    border-right: 1px solid ${customBorderColor};
                }
            `}</style>}
            <div className={'wrapper'}>
                <div className={'widget'}>
                    <div className={'player-stats'}>
                        <div className={'level'}>
                            <img src={`https://mxgic1337.xyz/fc/faceit${preview ? 10 : level}.svg`}
                                 alt={`Level ${preview ? 10 : level}`}/>
                            <div className={'elo'}>
                                <h2>{searchParams.get("player") || overrideUsername || "Player"}</h2>
                                <p>{tl(language, `widget.elo${(preview && overrideShowEloSuffix) || (!preview && (searchParams.get('suffix') === null || searchParams.get('suffix') === 'true')) ? '' : '_no_suffix'}`, [preview ? `2001` : `${elo}`])
                                    + ((preview && overrideShowEloDiff) || (!preview && (searchParams.get('diff') === 'true' || searchParams.get('diff') === null)) ? tl(language, 'widget.elo_diff', [0 > elo - startingElo ? `${elo - startingElo}` : `+${elo - startingElo}`]) : "")}</p>
                            </div>
                        </div>
                        <div className={'matches'}>
                            <div className={'stats'}>
                                <Statistic color={'green'} value={String(wins)} text={tl(language, 'widget.wins')}/>
                                <Statistic color={'red'} value={String(losses)} text={tl(language, 'widget.losses')}/>
                            </div>
                        </div>
                    </div>
                    {((preview && overrideShowAverage) || (!preview && searchParams.get('avg') === 'true')) &&
                        <div className={'average'}>
                            <div className={'stat'}>
                                <p>{tl(language, 'widget.kills')}</p>
                                <p>{preview ? 20 : Math.round(kills / avgMatches)}</p>
                            </div>
                            <div className={'stat'}>
                                <p>{tl(language, 'widget.deaths')}</p>
                                <p>{preview ? 10 : Math.round(deaths / avgMatches)}</p>
                            </div>
                            <div className={'stat'}>
                                <p>{tl(language, 'widget.kd')}</p>
                                <p>{preview ? 2 : Math.round((kills / deaths) * 100) / 100}</p>
                            </div>
                            <div className={'stat'}>
                                <p>{tl(language, 'widget.hs%')}</p>
                                <p>{preview ? 50 : Math.round(hsPercent / avgMatches)}%</p>
                            </div>
                        </div>}
                    {((preview && overrideShowEloProgressBar) || (!preview && searchParams.get('eloBar') === 'true')) &&
                        <div className={'progress-bar'}>
                            <div className={'progress'} style={{
                                width: preview || level === 10 ? '100%' : `${((elo - (eloDistribution[level - 1][1] as number)) / ((eloDistribution[level - 1][2] as number) - (eloDistribution[level - 1][1] as number))) * 100}%`,
                                background: eloDistribution[preview ? 9 : level - 1][0]
                            }}></div>
                        </div>}
                </div>
            </div>
        </>
    )
}
