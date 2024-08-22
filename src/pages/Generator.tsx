import {useEffect, useRef, useState} from "react";
import {themes, Widget} from "./Widget.tsx";
import {Separator} from "../components/Separator.tsx";
import {Language, languages, tl} from "../translations/translations.ts";
import {useNavigate} from "react-router-dom";

export const Generator = () => {
    const [customCSS, setCustomCSS] = useState<string>("https://example.com")
    const [username, setUsername] = useState<string>("Player")
    const [theme, setTheme] = useState<string>("dark")
    const [language, setLanguage] = useState<Language>(languages.find(language => language.id === localStorage.fcw_lang) || languages[0])

    const customCSSInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()

    useEffect(() => {
        document.getElementsByTagName("html")[0].classList.add(`generator`)
        return () => {
            document.getElementsByTagName("html")[0].classList.remove(`generator`)
        }
    }, []);

    return <>
        <main>
            <div>
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
                    <select onChange={event => {
                        const language = languages.find(language => language.id === event.target.value) || languages[0]
                        setLanguage(language);
                        navigate(`?lang=${language.id}`)
                    }}>
                        {languages.map(language => {
                            return <option value={language.id}>{language.name}</option>
                        })}
                    </select>
                </div>
                <Separator text={tl(language, 'generator.theme.title')}/>
                <div className={'setting'}>
                    <select onChange={(e) => setTheme(e.target.value)}>
                        {themes.map(theme => {
                            return <option value={theme.id}>{theme.name}</option>
                        })}
                    </select>
                    {theme === 'custom' && <>
                        <p>{tl(language, 'generator.theme.custom-css.title')}</p>
                        <input defaultValue={customCSS} ref={customCSSInputRef} onKeyDown={(e) => {
                            if (e.code !== "Enter") return
                            setCustomCSS(customCSSInputRef.current?.value as string)
                        }} />
                        <small>{tl(language, 'generator.theme.custom-css.apply')}</small>
                    </>}
                </div>
                <Separator text={tl(language, 'generator.generate.title')}/>
                <div className={'setting'}>
                    <p>{tl(language, 'generator.generate.info.0')}</p>
                    <p>{tl(language, 'generator.generate.info.1')}</p>
                    <input
                        value={`https://fc.mxgic1337.xyz/widget/?player=${username}&lang=${language.id}&theme=${theme}${customCSS && theme === "custom" ? `&css=${customCSS}` : ''}`}
                        readOnly={true}/>
                </div>
                <Separator text={tl(language, 'generator.preview.title')}/>
                <div className={`${theme}-theme preview`}>
                    {(theme === 'custom' && customCSS.length > 0) || theme !== 'custom' && <Widget preview={true} overrideUsername={username.length > 0 ? username : "Player"} overrideCustomCSS={customCSS} overrideTheme={theme} overrideLanguage={language.id}/>}
                </div>
                <br />
                <footer>
                    <small>This project is not affiliated with <a href={'https://faceit.com'}>FACEIT</a>.</small>
                    <small>Created by <a href={'https://github.com/mxgic1337'}>mxgic1337_</a> &bull; <a
                        href={'https://github.com/mxgic1337/faceit-stats-widget'}>GitHub</a></small>
                </footer>
            </div>
        </main>
    </>
}