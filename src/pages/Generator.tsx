import {useEffect, useState} from "react";
import {themes, Widget} from "./Widget.tsx";
import {Separator} from "../components/Separator.tsx";

export const Generator = () => {
    const [username, setUsername] = useState<string>("Player")
    const [theme, setTheme] = useState<string>("dark")

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
                <Separator text={'Ustawienia'}/>
                <div className={'setting'}>
                    <p>Nick FACEIT</p>
                    <input value={username} max={12} onChange={(e) => {
                        if (e.target.value.length > 12) return
                        setUsername(e.target.value)
                    }}/>
                </div>
                <Separator text={'Styl'}/>
                <div className={'setting'}>
                    <select onChange={(e) => setTheme(e.target.value)}>
                        {themes.map(theme => {
                            return <option value={theme.id}>{theme.name}</option>
                        })}
                    </select>
                </div>
                <Separator text={'Wygeneruj widżet'}/>
                <div className={'setting'}>
                    <p>Skopiuj ten link i wklej go do przeglądarki w <b>OBS Studio</b>.</p>
                    <p>Zalecane jest ustawienie szerokości przeglądarki na ok. <b>500</b></p>
                    <input value={`https://fc.mxgic1337.xyz/widget/?player=${username}&theme=${theme}`} readOnly={true} />
                </div>
                <Separator text={'Podgląd widżetu'}/>
                <div className={`${theme}-theme preview`}>
                    <Widget preview={true} overrideUsername={username.length > 0 ? username : "Player"}/>
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