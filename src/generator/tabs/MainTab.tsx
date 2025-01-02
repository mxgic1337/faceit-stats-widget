import {Language, languages, tl} from "../../translations/translations.ts";
import {Checkbox} from "../../components/generator/Checkbox.tsx";
import {Dispatch} from "react";
import {useNavigate} from "react-router-dom";
import {Separator} from "../../components/generator/Separator.tsx";
import {SavedConfigurations} from "../Generator.tsx";

type Props = {
  language: Language;
  username: string;
  showEloSuffix: boolean;
  showEloDiff: boolean;
  showEloProgressBar: boolean;
  showAverage: boolean;
  showRanking: boolean;
  showRankingOnlyWhenChallenger: boolean;
  refreshInterval: number;

  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setShowEloSuffix: Dispatch<boolean>;
  setShowEloDiff: Dispatch<boolean>;
  setShowEloProgressBar: Dispatch<boolean>;
  setShowAverage: Dispatch<boolean>;
  setShowRanking: Dispatch<boolean>;
  setShowRankingOnlyWhenChallenger: Dispatch<boolean>;
  setRefreshInterval: Dispatch<number>;
}

export const MainTab = ({
                          language, setLanguage,
                          username, setUsername,
                          showEloSuffix, setShowEloSuffix,
                          showEloDiff, setShowEloDiff,
                          showEloProgressBar, setShowEloProgressBar,
                          showAverage, setShowAverage,
                          showRanking, setShowRanking,
                          showRankingOnlyWhenChallenger, setShowRankingOnlyWhenChallenger,
                          refreshInterval, setRefreshInterval,
                        }: Props) => {
  const navigate = useNavigate();

  return <>
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
      <p>{tl(language, 'generator.settings.refresh_delay')}</p>
      <select value={refreshInterval} onChange={event => {
        setRefreshInterval(parseInt(event.currentTarget.value))
      }}>
        <option value={10}>{tl(language, 'generator.settings.refresh_delay.quick', ["10"])}</option>
        <option value={30}>{tl(language, 'generator.settings.refresh_delay.normal', ["30"])}</option>
        <option value={60}>{tl(language, 'generator.settings.refresh_delay.slow', ["60"])}</option>
      </select>
    </div>
    <div className={'setting'}>
      <Checkbox text={tl(language, 'generator.settings.show_elo_suffix')} state={showEloSuffix}
                setState={setShowEloSuffix}/>
      <Checkbox text={tl(language, 'generator.settings.show_elo_diff')} state={showEloDiff}
                setState={setShowEloDiff}/>
      <Checkbox text={tl(language, 'generator.settings.show_elo_progress_bar')} state={showEloProgressBar}
                setState={setShowEloProgressBar}/>
      <Checkbox text={tl(language, 'generator.settings.show_kd')} state={showAverage}
                setState={setShowAverage}/>
      <Checkbox text={tl(language, 'generator.settings.show_ranking')} state={showRanking}
                setState={setShowRanking}/>
      {showRanking &&
        <Checkbox text={tl(language, 'generator.settings.show_ranking_only_when_challenger')}
                  state={showRankingOnlyWhenChallenger}
                  setState={setShowRankingOnlyWhenChallenger}/>}
    </div>
    {localStorage.getItem("fcw_settings") && <>
      <Separator text={tl(language, 'generator.settings.load_saved_configuration')}/>
      <div className={'setting'}>
        <select>
          {(JSON.parse(localStorage.getItem("fcw_settings") as string) as SavedConfigurations).map((configuration) => {
            const createdAt = new Date(configuration._createdAt as number);
            return <option key={configuration._createdAt} value={configuration._createdAt}>
              {configuration.username} | {configuration.theme} | {configuration.colorScheme} | {createdAt.getDate()}.{createdAt.getMonth() + 1}.{createdAt.getFullYear()}
            </option>
          })}
        </select>
        <button>{tl(language, 'generator.settings.load_saved_configuration.apply')}</button>
        <button>{tl(language, 'generator.settings.load_saved_configuration.delete')}</button>
      </div>
    </>}
  </>
}