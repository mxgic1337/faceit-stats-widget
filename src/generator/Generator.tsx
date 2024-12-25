import {useCallback, useEffect, useState} from "react";
import {Widget} from "../../widget/src/widget/Widget.tsx";
import {Separator} from "../components/generator/Separator.tsx";
import {Language, languages, tl} from "../translations/translations.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getPlayerID} from "../utils/faceit_util.ts";
import {MainTab} from "./tabs/MainTab.tsx";
import {StyleTab} from "./tabs/StyleTab.tsx";
import {StatisticsTab, StatisticType} from "./tabs/StatisticsTab.tsx";
import {GeneratedWidgetModal} from "../components/generator/GeneratedWidgetModal.tsx";
import {InfoBox} from "../components/generator/InfoBox.tsx";

export const Generator = () => {

  const [customCSS, setCustomCSS] = useState<string>("https://example.com")
  const [generatedURL, setGeneratedURL] = useState<string | undefined>()
  const [username, setUsername] = useState<string>("Player")
  const [showRanking, setShowRanking] = useState<boolean>(true)
  const [showRankingOnlyWhenChallenger, setShowRankingOnlyWhenChallenger] = useState<boolean>(true)
  const [showEloDiff, setShowEloDiff] = useState<boolean>(true)
  const [showEloSuffix, setShowEloSuffix] = useState<boolean>(true)
  const [showStatistics, setShowStatistics] = useState<boolean>(true)
  const [showEloProgressBar, setShowEloProgressBar] = useState<boolean>(true)
  const [useBannerAsBackground, setUseBannerAsBackground] = useState<boolean>(false)
  const [colorScheme, setColorScheme] = useState<string>("dark")
  const [theme, setTheme] = useState<string>("normal")
  const [language, setLanguage] = useState<Language>(languages.find(language => language.id === localStorage.fcw_lang) || languages[0])

  const [customBorderColor1, setCustomBorderColor1] = useState<string>('#595959')
  const [customBorderColor2, setCustomBorderColor2] = useState<string>('#8d8d8d')
  const [customTextColor, setCustomTextColor] = useState<string>('#ffffff')
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>('#121212')

  const [statSlot1, setStatSlot1] = useState<StatisticType>(StatisticType.KILLS)
  const [statSlot2, setStatSlot2] = useState<StatisticType>(StatisticType.KD)
  const [statSlot3, setStatSlot3] = useState<StatisticType>(StatisticType.HSPERCENT)
  const [statSlot4, setStatSlot4] = useState<StatisticType>(StatisticType.WINRATIO)

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

      let params: { [key: string]: string | number | boolean | string[] } = {
        "player_id": id,
        "lang": language.id,
        "eloBar": showEloProgressBar,
        "avg": showStatistics,
        "suffix": showEloSuffix,
        "diff": showEloDiff,
        "scheme": colorScheme,
        "theme": theme,
        "ranking": showRanking ? showRankingOnlyWhenChallenger ? 2 : 1 : 0,
        "banner": useBannerAsBackground,
        "stats": [
          statSlot1,
          statSlot2,
          statSlot3,
          statSlot4,
        ],
      }

      if (theme === "custom") {
        params = {
          ...params,
          "css": customCSS,
        }
      }

      if (colorScheme === "custom") {
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
  }, [customBackgroundColor, customBorderColor1, customBorderColor2, customCSS, customTextColor, language, showStatistics, showEloDiff, showEloProgressBar, showEloSuffix, showRanking, showRankingOnlyWhenChallenger, theme, username, colorScheme, useBannerAsBackground, statSlot1, statSlot2, statSlot3, statSlot4])

  const jsonToQuery = useCallback((params: { [key: string]: string | number | boolean | string[] }) => {
    return `?${Object.entries(params).map((param) => {
      return `${param[0]}=${param[1]}`
    }).join('&')}`
  }, [])

  const tabs = [
    {
      name: tl(language, 'generator.settings.title'),
      component: <MainTab key={'main'} username={username} setUsername={setUsername} language={language}
                          setLanguage={setLanguage}
                          showEloSuffix={showEloSuffix} setShowEloSuffix={setShowEloSuffix}
                          showAverage={showStatistics}
                          setShowAverage={setShowStatistics}
                          showRanking={showRanking} setShowRanking={setShowRanking}
                          showEloProgressBar={showEloProgressBar}
                          setShowEloProgressBar={setShowEloProgressBar}
                          showEloDiff={showEloDiff} setShowEloDiff={setShowEloDiff}
                          showRankingOnlyWhenChallenger={showRankingOnlyWhenChallenger}
                          setShowRankingOnlyWhenChallenger={setShowRankingOnlyWhenChallenger}
      />
    },
    {
      name: tl(language, 'generator.theme.title'),
      component: <StyleTab key={'style'} language={language} customBorderColor1={customBorderColor1}
                           customBorderColor2={customBorderColor2}
                           setCustomBorderColor1={setCustomBorderColor1}
                           setCustomBorderColor2={setCustomBorderColor2}
                           customBackgroundColor={customBackgroundColor}
                           setCustomBackgroundColor={setCustomBackgroundColor}
                           customTextColor={customTextColor} setCustomTextColor={setCustomTextColor}
                           customCSS={customCSS} setCustomCSS={setCustomCSS}
                           theme={theme} setTheme={setTheme} colorScheme={colorScheme}
                           useBannerAsBackground={useBannerAsBackground}
                           setUseBannerAsBackground={setUseBannerAsBackground}

                           setColorScheme={setColorScheme}/>
    },
    {
      name: tl(language, 'generator.stats.title'),
      component: <StatisticsTab key={'stats'} language={language} showStatistics={showStatistics}
                                statSlot1={statSlot1} setStatSlot1={setStatSlot1}
                                statSlot2={statSlot2} setStatSlot2={setStatSlot2}
                                statSlot3={statSlot3} setStatSlot3={setStatSlot3}
                                statSlot4={statSlot4} setStatSlot4={setStatSlot4}
      />
    }
  ]

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  return <>
    <GeneratedWidgetModal language={language} url={generatedURL} setURL={setGeneratedURL}/>
    <main>
      <section className={'fixed-width'}>
        <header>
          <h2>FACEIT Widget Generator</h2>
        </header>
        <div className={'tabs'}>
          {tabs.map((tab, index) => {
            return <button key={tab.name} onClick={() => {
              setSelectedTabIndex(index)
            }} className={index === selectedTabIndex ? "active" : ""}>{tab.name}</button>
          })}
        </div>
        {import.meta.env.VITE_IS_TESTING && <InfoBox content={tl(language, 'generator.testing')} style={'info'}/>}
        {tabs[selectedTabIndex].component}
        <br/>
        <footer>
          <small>This project is not affiliated with <a href={'https://faceit.com'}
                                                        target={'_blank'}>FACEIT</a>.</small>
          <small>Copyright &copy; <a href={'https://github.com/mxgic1337'} target={'_blank'}>mxgic1337_</a> 2024</small>
          <small>
            <a href={'https://github.com/mxgic1337/faceit-stats-widget/blob/master/LICENSE'} target={'_blank'}>MIT
              License</a> &bull; <a
            href={'https://github.com/mxgic1337/faceit-stats-widget'} target={'_blank'}>GitHub</a> &bull; <a
            href={'https://github.com/mxgic1337/faceit-stats-widget/issues/new'} target={'_blank'}>Report an issue</a>
          </small>
        </footer>
      </section>
      <section className={'preview'}>
        <Separator text={tl(language, 'generator.preview.title')}/>
        <div className={`${theme}-theme ${colorScheme}-scheme preview`}>
          <Widget preview={true} overrideShowEloDiff={showEloDiff} overrideShowEloSuffix={showEloSuffix}
                  overrideRankingState={showRanking}
                  overrideShowAverage={showStatistics}
                  overrideShowEloProgressBar={showEloProgressBar}
                  overrideUsername={username.length > 0 ? username : "Player"}
                  overrideCustomCSS={customCSS} overrideCustomScheme={colorScheme === "custom"}
                  overrideLanguage={language.id}
                  overrideBorder1={customBorderColor1} overrideBorder2={customBorderColor2}
                  overrideTextColor={customTextColor} overrideBackground={customBackgroundColor}
                  overrideUseBannerAsBackground={useBannerAsBackground}
                  overrideStatistics={[statSlot1, statSlot2, statSlot3, statSlot4]}
          />
        </div>
        <button onClick={() => {
          generateLink()
        }}>{tl(language, 'generator.generate.button')}</button>
      </section>
    </main>
  </>
}