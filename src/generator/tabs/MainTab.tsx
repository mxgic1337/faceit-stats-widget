import {Language, languages, tl} from "../../translations/translations.ts";
import {Checkbox} from "../../components/Checkbox.tsx";
import {Dispatch} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
  language: Language;
  username: string;
  showEloSuffix: boolean;
  showEloDiff: boolean;
  showEloProgressBar: boolean;
  showAverage: boolean;
  showRanking: boolean;
  showRankingOnlyWhenChallenger: boolean;

  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setShowEloSuffix: Dispatch<boolean>;
  setShowEloDiff: Dispatch<boolean>;
  setShowEloProgressBar: Dispatch<boolean>;
  setShowAverage: Dispatch<boolean>;
  setShowRanking: Dispatch<boolean>;
  setShowRankingOnlyWhenChallenger: Dispatch<boolean>;
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
                        }: Props) => {
  const navigate = useNavigate();

  return <>
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
      <Checkbox text={tl(language, 'generator.settings.show_kd')} state={showAverage}
                setState={setShowAverage}/>
      <Checkbox text={tl(language, 'generator.settings.show_ranking')} state={showRanking}
                setState={setShowRanking}/>
      {showRanking &&
        <Checkbox text={tl(language, 'generator.settings.show_ranking_only_when_challenger')}
                  state={showRankingOnlyWhenChallenger}
                  setState={setShowRankingOnlyWhenChallenger}/>}
    </div>
  </>
}