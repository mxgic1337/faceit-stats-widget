import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {themes, Widget} from "../widget/Widget.tsx";
import {Separator} from "../components/Separator.tsx";
import {Language, languages, tl} from "../translations/translations.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {ColorPicker} from "../components/ColorPicker.tsx";
import {getPlayerID} from "../utils/faceit_util.ts";
import {MainTab} from "./tabs/MainTab.tsx";
import {StyleTab} from "./tabs/StyleTab.tsx";

export const Generator = () => {

    const [customCSS, setCustomCSS] = useState<string>("https://example.com")
    const [generatedURL, setGeneratedURL] = useState<string>()
    const [username, setUsername] = useState<string>("Player")
    const [showRanking, setShowRanking] = useState<boolean>(true)
    const [showRankingOnlyWhenChallenger, setShowRankingOnlyWhenChallenger] = useState<boolean>(false)
    const [showEloDiff, setShowEloDiff] = useState<boolean>(true)
    const [showEloSuffix, setShowEloSuffix] = useState<boolean>(true)
    const [showAverage, setShowAverage] = useState<boolean>(true)
    const [showEloProgressBar, setShowEloProgressBar] = useState<boolean>(true)
    const [theme, setTheme] = useState<string>("dark")
    const [language, setLanguage] = useState<Language>(languages.find(language => language.id === localStorage.fcw_lang) || languages[0])

    const [customBorderColor1, setCustomBorderColor1] = useState<string>('#595959')
    const [customBorderColor2, setCustomBorderColor2] = useState<string>('#8d8d8d')
    const [customTextColor, setCustomTextColor] = useState<string>('#ffffff')
    const [customBackgroundColor, setCustomBackgroundColor] = useState<string>('#121212')

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        document.getElementsByTagName("html")[0].classList.add(`generator`)
        return () => {
            document.getElementsByTagName("html")[0].classList.remove(`generator`)
        }
    }, []);

    useEffect(() => {
        if (!searchParams.get("lang")) navigate(`?lang=${language.id}`)
    }, []);

    const generateLink = useCallback(() => {
        getPlayerID(username).then(id => {
            if (!id) {
                alert(tl(language, 'generator.alert.player_not_found', [username]));
                return
            }

            let params: { [key: string]: string | number | boolean } = {
                "player_id": id,
                "lang": language.id,
                "eloBar": showEloProgressBar,
                "avg": showAverage,
                "suffix": showEloSuffix,
                "diff": showEloDiff,
                "theme": theme,
                "ranking": showRanking ? showRankingOnlyWhenChallenger ? 2 : 1 : 0,
            }

            if (theme === "custom") {
                params = {
                    ...params,
                    "css": customCSS,
                }
            }

            if (['normal-custom', 'compact-custom'].includes(theme)) {
                params = {
                    ...params,
                    "color": customTextColor.substring(1),
                    "bg-color": customBackgroundColor.substring(1),
                    "border1": customBorderColor1.substring(1),
                    "border2": customBorderColor2.substring(1),
                }
            }

            setGeneratedURL(`${window.location.protocol}//${window.location.host}/widget/${jsonToQuery(params)}`)
        }).catch()
    }, [customBackgroundColor, customBorderColor1, customBorderColor2, customCSS, customTextColor, language, showAverage, showEloDiff, showEloProgressBar, showEloSuffix, showRanking, showRankingOnlyWhenChallenger, theme, username])

    const jsonToQuery = useCallback((params: { [key: string]: string | number | boolean }) => {
        return `?${Object.entries(params).map((param) => {
            return `${param[0]}=${param[1]}`
        }).join('&')}`
    }, [])

    const tabs = useMemo(() => [
        {name: tl(language, 'generator.settings.title'), component: <MainTab username={username} setUsername={setUsername} language={language} setLanguage={setLanguage}
                                       showEloSuffix={showEloSuffix} setShowEloSuffix={setShowEloSuffix} showAverage={showAverage}
                                       setShowAverage={setShowAverage}
                                       showRanking={showRanking} setShowRanking={setShowRanking} showEloProgressBar={showEloProgressBar}
                                       setShowEloProgressBar={setShowEloProgressBar}
                                       showEloDiff={showEloDiff} setShowEloDiff={setShowEloDiff}
                                       showRankingOnlyWhenChallenger={showRankingOnlyWhenChallenger} setShowRankingOnlyWhenChallenger={setShowRankingOnlyWhenChallenger}
            />},
        {name: tl(language, 'generator.theme.title'), component: <StyleTab language={language} customBorderColor1={customBorderColor1} customBorderColor2={customBorderColor2}
            setCustomBorderColor1={setCustomBorderColor1} customBorderColor2={customBorderColor2} customBackgroundColor={customBackgroundColor} />}
    ], [language])

    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    return <>
        <main>
            <section>
                <header>
                    <h2>FACEIT Widget Generator</h2>
                </header>
                <div className={'tabs'}>
                    {tabs.map((tab, index) => {
                        return <button onClick={()=>{
                            setSelectedTabIndex(index)
                        }}>{tab.name}</button>
                    })}
                </div>
                {tabs[selectedTabIndex].component}

                <Separator text={tl(language, 'generator.theme.title')}/>
                <Separator text={tl(language, 'generator.generate.title')}/>
                <div className={'setting generate'}>
                    <p>{tl(language, 'generator.generate.info.0')}</p>
                    <p style={{fontWeight: 'bold'}}>{tl(language, 'generator.generate.info.1')}</p>
                    {generatedURL && <input
                        value={generatedURL}
                        readOnly={true}/>}
                    <div className={'buttons'}>
                        <button onClick={() => {
                            generateLink()
                        }}>{tl(language, 'generator.generate.button')}</button>
                        <button disabled={!generatedURL} onClick={() => {
                            window.open(generatedURL, '_blank')
                        }}>{tl(language, 'generator.generate.open_in_browser.button')}</button>
                    </div>
                </div>
                <br/>
                <footer>
                    <small>This project is not affiliated with <a href={'https://faceit.com'}>FACEIT</a>.</small>
                    <small>Created by <a href={'https://github.com/mxgic1337'}>mxgic1337_</a> &bull; <a
                        href={'https://github.com/mxgic1337/faceit-stats-widget'}>GitHub</a></small>
                </footer>
            </section>
            <section className={'preview'}>
                <Separator text={tl(language, 'generator.preview.title')}/>
                <div className={`${theme}-theme preview`}>
                    <Widget preview={true} overrideShowEloDiff={showEloDiff} overrideShowEloSuffix={showEloSuffix}
                            overrideRankingState={showRanking}
                            overrideShowAverage={showAverage}
                            overrideShowEloProgressBar={showEloProgressBar}
                            overrideUsername={username.length > 0 ? username : "Player"}
                            overrideCustomCSS={customCSS} overrideTheme={theme} overrideLanguage={language.id}
                            overrideBorder1={customBorderColor1} overrideBorder2={customBorderColor2}
                            overrideTextColor={customTextColor} overrideBackground={customBackgroundColor}
                    />
                </div>
            </section>
        </main>
    </>
}