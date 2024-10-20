import {useEffect, useRef, useState} from "react";
import {themes, Widget} from "./Widget.tsx";
import {Separator} from "../components/Separator.tsx";
import {Language, languages, tl} from "../translations/translations.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Checkbox} from "../components/Checkbox.tsx";
import {ColorPicker} from "../components/ColorPicker.tsx";

export const Generator = () => {
    const [customCSS, setCustomCSS] = useState<string>("https://example.com")
    const [username, setUsername] = useState<string>("Player")
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

    const customCSSInputRef = useRef<HTMLInputElement>(null);
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

    return <>
        <main>
            <section>
                <header>
                    <h2>FACEIT Widget Generator</h2>
                </header>
                <Separator text={tl(language, 'generator.settings.title')}/>
                <div className={'setting'}>

                    <p>{tl(language, 'generator.settings.faceit_name')}</p>
                    <input value={username} max={12} onChange={(e) => {
                        if (e.target.value.length > 12) return
                        setUsername(e.target.value)
                    }}/>
                </div>
                <div className={'setting'}>
                    <p>{tl(language, 'generator.settings.language')}</p>
                    <select value={language.id} onChange={event => {
                        const language = languages.find(language => language.id === event.target.value) || languages[0]
                        setLanguage(language);
                        localStorage.setItem("fcw_lang", language.id)
                        navigate(`?lang=${language.id}`)
                    }}>
                        {languages.map(language => {
                            return <option key={language.id} value={language.id}>{language.name}</option>
                        })}
                    </select>
                </div>
                <div className={'setting'}>
                    <Checkbox text={tl(language, 'generator.settings.show_elo_suffix')} state={showEloSuffix}
                              setState={setShowEloSuffix}/>
                    <Checkbox text={tl(language, 'generator.settings.show_elo_diff')} state={showEloDiff}
                              setState={setShowEloDiff}/>
                    <Checkbox text={tl(language, 'generator.settings.show_elo_progress_bar')} state={showEloProgressBar}
                              setState={setShowEloProgressBar}/>
                    <Checkbox text={tl(language, 'generator.settings.show_kd')} state={showAverage} setState={setShowAverage}/>
                </div>
                <Separator text={tl(language, 'generator.theme.title')}/>
                <div className={'setting'}>
                    <select onChange={(e) => setTheme(e.target.value)}>
                        {themes.map(theme => {
                            return <option key={theme.id} value={theme.id}>{theme.name}</option>
                        })}
                    </select>

                    {(theme === 'normal-custom' || theme === 'compact-custom') && <>
                        <ColorPicker text={tl(language, 'generator.theme.border-color-1')} color={customBorderColor1}
                                     setColor={setCustomBorderColor1}/>
                        <ColorPicker text={tl(language, 'generator.theme.border-color-2')} color={customBorderColor2}
                                     setColor={setCustomBorderColor2}/>
                        <ColorPicker text={tl(language, 'generator.theme.text-color')}
                                     color={customTextColor} setColor={setCustomTextColor}/>
                        <ColorPicker text={tl(language, 'generator.theme.background-color')}
                                     color={customBackgroundColor} setColor={setCustomBackgroundColor}/>
                    </>}

                    {theme === 'custom' && <>
                        <p>{tl(language, 'generator.theme.custom-css.title')}</p>
                        <input defaultValue={customCSS} ref={customCSSInputRef} onKeyDown={(e) => {
                            if (e.code !== "Enter") return
                            setCustomCSS(customCSSInputRef.current?.value as string)
                        }}/>
                        <small>{tl(language, 'generator.theme.custom-css.apply')}</small>
                    </>}
                </div>
                <Separator text={tl(language, 'generator.generate.title')}/>
                <div className={'setting'}>
                    <p>{tl(language, 'generator.generate.info.0')}</p>
                    <p>{tl(language, 'generator.generate.info.1')}</p>
                    <input
                        value={`${window.location.protocol}//${window.location.host}/widget/?player=${username}&lang=${language.id}&eloBar=${showEloProgressBar}&avg=${showAverage}&suffix=${showEloSuffix}&diff=${showEloDiff}&theme=${theme}${customCSS && theme === "custom" ? `&css=${customCSS}` : ''}${['normal-custom', 'compact-custom'].includes(theme) ? `&color=${customTextColor.substring(1)}&bg-color=${customBackgroundColor.substring(1)}&border1=${customBorderColor1.substring(1)}&border2=${customBorderColor2.substring(1)}` : ''}`}
                        readOnly={true}/>
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
                    <Widget preview={true} overrideShowEloDiff={showEloDiff} overrideShowEloSuffix={showEloSuffix} overrideShowAverage={showAverage}
                            overrideShowEloProgressBar={showEloProgressBar}
                            overrideUsername={username.length > 0 ? username : "Player"}
                            overrideCustomCSS={customCSS} overrideTheme={theme} overrideLanguage={language.id}
                            overrideBorder1={customBorderColor1} overrideBorder2={customBorderColor2} overrideTextColor={customTextColor} overrideBackground={customBackgroundColor}
                    />
                </div>
            </section>
        </main>
    </>
}