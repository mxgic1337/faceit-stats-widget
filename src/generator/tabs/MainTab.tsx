import { Language, languages } from '../../translations/translations.ts';
import { Checkbox } from '../../components/generator/Checkbox.tsx';
import { Dispatch, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../../components/generator/Separator.tsx';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import { getPlayerProfile } from '../../../widget/src/utils/faceit_util.ts';

type Props = {
  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setPlayerId: Dispatch<string>;
  setPlayerBanner: Dispatch<string | undefined>;
  setAutoWidth: Dispatch<boolean>;
  setShowUsername: Dispatch<boolean>;
  setShowEloSuffix: Dispatch<boolean>;
  setShowEloDiff: Dispatch<boolean>;
  setShowEloProgressBar: Dispatch<boolean>;
  setShowStatistics: Dispatch<boolean>;
  setShowRanking: Dispatch<boolean>;
  setShowRankingOnlyWhenChallenger: Dispatch<boolean>;
  setOnlyOfficialMatchesCount: Dispatch<boolean>;
  setRefreshInterval: Dispatch<number>;
  setSaveSession: Dispatch<boolean>;
};

export const MainTab = ({
  setLanguage,
  setUsername,
  setPlayerId,
  setPlayerBanner,
  setAutoWidth,
  setShowUsername,
  setShowEloSuffix,
  setShowEloDiff,
  setShowEloProgressBar,
  setShowStatistics,
  setShowRanking,
  setShowRankingOnlyWhenChallenger,
  setOnlyOfficialMatchesCount,
  setRefreshInterval,
  setSaveSession,
}: Props) => {
  const [changingUsername, setChangingUsername] = useState<boolean>(false);
  const [usernameInputValue, setUsernameInputValue] = useState<string>('');
  const navigate = useNavigate();
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);

  useEffect(() => {
    setUsernameInputValue(settings?.username || '?');
  }, [settings]);

  if (!settings || !tl) {
    return null;
  }

  return (
    <>
      <Separator text={tl('generator.settings.title')} />
      <div className={'setting'}>
        <p>{tl('generator.settings.faceit_name')}</p>
        <div className={'flex'}>
          <input
            max={12}
            value={usernameInputValue}
            disabled={!changingUsername}
            onChange={(e) => {
              if (e.target.value.length > 12) return;
              setUsernameInputValue(e.target.value);
            }}
          />
          <button
            style={{ width: '250px' }}
            onClick={() => {
              if (changingUsername) {
                // TODO: Get player info from FACEIT
                getPlayerProfile(usernameInputValue).then((res) => {
                  if (res) {
                    setUsername(res.nickname);
                    setPlayerBanner(res.cover_image);
                    setChangingUsername(false);
                  } else {
                    alert(
                      tl('generator.alert.player_not_found', [
                        usernameInputValue,
                      ])
                    );
                  }
                });
              } else {
                setChangingUsername(true);
              }
            }}
          >
            {changingUsername
              ? tl('generator.settings.save_username')
              : tl('generator.settings.change_username')}
          </button>
        </div>
      </div>
      <div className={'setting'}>
        <p>{tl('generator.settings.language')}</p>
        <select
          value={settings.language.id}
          onChange={(event) => {
            const language =
              languages.find(
                (language) => language.id === event.target.value
              ) || languages[0];
            setLanguage(language);
            localStorage.setItem('fcw_lang', language.id);
            navigate(`?lang=${language.id}`);
          }}
        >
          {languages.map((language) => {
            return (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={'setting'}>
        <p>{tl('generator.settings.refresh_delay')}</p>
        <select
          value={settings.refreshInterval}
          onChange={(event) => {
            setRefreshInterval(parseInt(event.currentTarget.value));
          }}
        >
          <option value={10}>
            {tl('generator.settings.refresh_delay.quick', ['10'])}
          </option>
          <option value={30}>
            {tl('generator.settings.refresh_delay.normal', ['30'])}
          </option>
          <option value={60}>
            {tl('generator.settings.refresh_delay.slow', ['60'])}
          </option>
        </select>
      </div>
      <Separator />
      <div className={'setting'}>
        <Checkbox
          text={tl('generator.settings.show_username')}
          state={settings.showUsername}
          setState={setShowUsername}
        />
        <Checkbox
          text={tl('generator.settings.show_elo_suffix')}
          state={settings.showEloSuffix}
          setState={setShowEloSuffix}
        />
        <Checkbox
          text={tl('generator.settings.show_elo_diff')}
          state={settings.showEloDiff}
          setState={setShowEloDiff}
        />
        <Checkbox
          text={tl('generator.settings.show_elo_progress_bar')}
          state={settings.showEloProgressBar}
          setState={setShowEloProgressBar}
        />
        <Checkbox
          text={tl('generator.settings.show_kd')}
          state={settings.showStatistics}
          setState={setShowStatistics}
        />
        <Checkbox
          text={tl('generator.settings.show_ranking')}
          state={settings.showRanking}
          setState={setShowRanking}
        />
        {settings.showRanking && (
          <Checkbox
            text={tl('generator.settings.show_ranking_only_when_challenger')}
            state={settings.showRankingOnlyWhenChallenger}
            setState={setShowRankingOnlyWhenChallenger}
          />
        )}
      </div>
      <Separator />
      <div className={'setting'}>
        <Checkbox
          text={tl('generator.settings.auto_width')}
          state={settings.autoWidth}
          setState={setAutoWidth}
        />
        <Checkbox
          text={tl('generator.settings.save_session')}
          state={settings.saveSession}
          setState={setSaveSession}
        />
        <Checkbox
          text={tl('generator.settings.only_official_matches')}
          state={settings.onlyOfficialMatchesCount}
          setState={setOnlyOfficialMatchesCount}
        />
      </div>
    </>
  );
};
