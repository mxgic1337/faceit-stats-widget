import {Language, languages, tl} from "../../translations/translations.ts";
import {Checkbox} from "../../components/generator/Checkbox.tsx";
import {Dispatch} from "react";
import {useNavigate} from "react-router-dom";
import {Separator} from "../../components/generator/Separator.tsx";

type Props = {
  language: Language;
  username: string;
  showUsername: boolean;
  showEloSuffix: boolean;
  showEloDiff: boolean;
  showEloProgressBar: boolean;
  showAverage: boolean;
  showRanking: boolean;
  autoWidth: boolean;
  showRankingOnlyWhenChallenger: boolean;
  onlyOfficialMatchesCount: boolean;
  refreshInterval: number;

  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setAutoWidth: Dispatch<boolean>;
  setShowUsername: Dispatch<boolean>;
  setShowEloSuffix: Dispatch<boolean>;
  setShowEloDiff: Dispatch<boolean>;
  setShowEloProgressBar: Dispatch<boolean>;
  setShowAverage: Dispatch<boolean>;
  setShowRanking: Dispatch<boolean>;
  setShowRankingOnlyWhenChallenger: Dispatch<boolean>;
  setOnlyOfficialMatchesCount: Dispatch<boolean>;
  setRefreshInterval: Dispatch<number>;
}

export const MainTab = ({
                          language, setLanguage,
                          username, setUsername,
                          autoWidth, setAutoWidth,
                          showUsername, setShowUsername,
                          showEloSuffix, setShowEloSuffix,
                          showEloDiff, setShowEloDiff,
                          showEloProgressBar, setShowEloProgressBar,
                          showAverage, setShowAverage,
                          showRanking, setShowRanking,
                          showRankingOnlyWhenChallenger, setShowRankingOnlyWhenChallenger,
                          onlyOfficialMatchesCount, setOnlyOfficialMatchesCount,
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
      <Checkbox text={tl(language, 'generator.settings.show_username')} state={showUsername}
                setState={setShowUsername}/>
      <Checkbox text={tl(language, 'generator.settings.show_elo_suffix')} state={showEloSuffix}
                setState={setShowEloSuffix}/>
      <Checkbox text={tl(language, 'generator.settings.show_elo_diff')} state={showEloDiff}
                setState={setShowEloDiff}/>
      <Checkbox text={tl(language, 'generator.settings.show_elo_progress_bar')} state={showEloProgressBar}
                setState={setShowEloProgressBar}/>
      <Checkbox text={tl(language, 'generator.settings.show_kd')} state={showAverage}
                setState={setShowAverage}/>
      <Checkbox text={tl(language, 'generator.settings.auto_width')} state={autoWidth}
                setState={setAutoWidth}/>
      <Checkbox text={tl(language, 'generator.settings.show_ranking')} state={showRanking}
                setState={setShowRanking}/>
      {showRanking &&
        <Checkbox text={tl(language, 'generator.settings.show_ranking_only_when_challenger')}
                  state={showRankingOnlyWhenChallenger}
                  setState={setShowRankingOnlyWhenChallenger}/>}
      <Checkbox text={tl(language, 'generator.settings.only_official_matches')} state={onlyOfficialMatchesCount}
                setState={setOnlyOfficialMatchesCount}/>
    </div>
  </>
}