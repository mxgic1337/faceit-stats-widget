import '../css/App.scss'
import {Statistic} from "../components/Statistic.tsx";
import {useCallback, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Language, languages, tl} from "../translations/translations.ts";
import {getPlayerID, getPlayerStats} from "../utils/faceit_util.ts";

import fc1 from '../assets/levels/faceit1.svg'
import fc2 from '../assets/levels/faceit2.svg'
import fc3 from '../assets/levels/faceit3.svg'
import fc4 from '../assets/levels/faceit4.svg'
import fc5 from '../assets/levels/faceit5.svg'
import fc6 from '../assets/levels/faceit6.svg'
import fc7 from '../assets/levels/faceit7.svg'
import fc8 from '../assets/levels/faceit8.svg'
import fc9 from '../assets/levels/faceit9.svg'
import fc10 from '../assets/levels/faceit10.svg'
import fcChallenger from '../assets/levels/challenger.svg'
import fcChallenger1 from '../assets/levels/challenger_1.svg'
import fcChallenger2 from '../assets/levels/challenger_2.svg'
import fcChallenger3 from '../assets/levels/challenger_3.svg'

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
    overrideRankingState?: boolean,
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

const levelIcons = [
    fc1, fc2, fc3, fc4, fc5, fc6, fc7, fc8, fc9, fc10,
    fcChallenger, fcChallenger1, fcChallenger2, fcChallenger3, /* Challenger (Top 1000, Top 1, Top 2, Top 3) */
]

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
    ['#e80128', 2001], /* Challenger: 4-1000 */
    ['#d9a441', 2001], /* Challenger: 1 */
    ['#c7d0d5', 2001], /* Challenger: 2 */
    ['#bf7145', 2001], /* Challenger: 3 */
]

enum RankingState {
    DISABLED = 0,
    SHOW = 1,
    ONLY_WHEN_CHALLENGER = 2,
}

export const Widget = ({
                           preview,
                           overrideUsername,
                           overrideRankingState,
                           overrideTheme,
                           overrideBorder1,
                           overrideBorder2,
                           overrideTextColor,
                           overrideBackground,
                           overrideCustomCSS,
                           overrideLanguage,
                           overrideShowAverage,
                           overrideShowEloDiff,
                           overrideShowEloSuffix,
                           overrideShowEloProgressBar
                       }: Props) => {
    const [level, setLevel] = useState(1)
    const [language, setLanguage] = useState<Language>(languages[0])
    const [startingElo, setStartingElo] = useState<number>(100)
    const [elo, setElo] = useState(100)
    const [ranking, setRanking] = useState(999)
    const [kills, setKills] = useState(0)
    const [deaths, setDeaths] = useState(0)
    const [hsPercent, setHSPercent] = useState(0)
    const [avgMatches, setAvgMatches] = useState(0)
    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)
    const [username, setUsername] = useState<string>()
    const [currentEloDistribution, setCurrentEloDistribution] = useState<(string | number)[]>(eloDistribution[0])
    const [rankingState, setRankingState] = useState<RankingState>(0)

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
            } else {
                setCustomColor(`#${searchParams.get('color')}`)
                setCustomBackgroundColor(`#${searchParams.get('bg-color')}`)
                setCustomBorderColor(`#${searchParams.get('border1')}`)
                setCustomBorderColor2(`#${searchParams.get('border2')}`)
            }
        } else {
            setCustomColorScheme(false)
        }
    }, [overrideTheme, overrideTextColor, overrideBackground, overrideBorder1, overrideBorder2]);

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const getIcon = useCallback(() => {
        if (preview) return levelIcons[10]
        if (level === 10 && ranking <= 1000) {
            if (ranking === 1) return levelIcons[11]
            else if (ranking === 2) return levelIcons[12]
            else if (ranking === 3) return levelIcons[13]
            return levelIcons[10] /* Challenger */
        }
        return levelIcons[level - 1]
    }, [level, ranking, preview])

    const getEloDistribution = useCallback((level: number, ranking: number) => {
        if (preview) return eloDistribution[10]
        if (level === 10 && ranking <= 1000) {
            if (ranking === 1) return eloDistribution[11]
            else if (ranking === 2) return eloDistribution[12]
            else if (ranking === 3) return eloDistribution[13]
            return eloDistribution[10] /* Challenger */
        }
        return eloDistribution[level - 1]
    }, [preview])

    useEffect(() => {
        const language = languages.find(language => language.id === searchParams.get("lang"));
        if (language) setLanguage(language);
    }, [overrideLanguage, searchParams]);

    useEffect(() => {
        if (preview) {setCurrentEloDistribution(eloDistribution[10]); return;}
        let rankingParam = parseInt(searchParams.get('ranking') || "2");
        console.log(searchParams.get('ranking'), rankingParam)
        if (isNaN(rankingParam)) rankingParam = RankingState.ONLY_WHEN_CHALLENGER
        setRankingState(rankingParam)

        const startDate = new Date();

        let theme = searchParams.get("theme") || "dark";
        if (!themes.find(theme1 => theme1.id === theme)) {
            theme = "dark"
        }

        const playerId = searchParams.get("player_id")
        if (playerId === null) {
            const username = searchParams.get("player");
            if (username !== null) {
                getPlayerID(username).then((id) => {
                    window.open(`${window.location}&player_id=${id}`, '_self');
                })
                return
            }
            navigate('?player_id=24180323-d946-4bb7-a334-be3e96fcac05')
            return
        }

        const getStats = (firstTime?: boolean) => {
            getPlayerStats(playerId, startDate).then((player) => {
                if (!player) return;
                setUsername(player.username)

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

                setRanking(player.ranking)
                setCurrentEloDistribution(getEloDistribution(player.level, player.ranking))
            })
        }
        getStats(true)
        const interval =
            setInterval(getStats, 1000 * 30)
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
                            <img src={getIcon()}
                                 alt={`Level ${preview ? 10 : level}`}/>
                            <div className={'elo'}>
                                <h2>{username || searchParams.get("player") || overrideUsername || "?"}</h2>
                                <p>{(overrideRankingState || (rankingState === RankingState.ONLY_WHEN_CHALLENGER && ranking <= 1000) || rankingState === RankingState.SHOW) && <>#{ranking} </>}{tl(language, `widget.elo${(preview && overrideShowEloSuffix) || (!preview && (searchParams.get('suffix') === null || searchParams.get('suffix') === 'true')) ? '' : '_no_suffix'}`, [preview ? `2001` : `${elo}`])
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
                                width: preview || level === 10 ? '100%' : `${((elo - (currentEloDistribution[1] as number)) / ((currentEloDistribution[2] as number) - (currentEloDistribution[1] as number))) * 100}%`,
                                background: currentEloDistribution[0]
                            }}></div>
                        </div>}
                </div>
            </div>
        </>
    )
}
