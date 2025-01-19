import { Language, languages } from '../../translations/translations.ts';
import { Checkbox } from '../../components/Checkbox.tsx';
import { Dispatch, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import { InfoBox } from '../../components/InfoBox.tsx';

type Props = {
  playerExists: boolean | undefined;
  setLanguage: Dispatch<Language>;
  setWidgetLanguage: Dispatch<Language | undefined>;
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
  setSelectedTabIndex: Dispatch<number>;
};

export const MainTab = ({
  playerExists,
  setLanguage,
  setWidgetLanguage,
  setAutoWidth,
  setUsername,
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
  setSelectedTabIndex,
}: Props) => {
  const navigate = useNavigate();
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);

  if (!settings || !tl) {
    return null;
  }

  return (
    <>
      <div className={'settings'}>
        <div className={'setting'}>
          <p>{tl('generator.settings.faceit_name')}</p>
          <input
            max={12}
            value={settings.username}
            onChange={(e) => {
              if (e.target.value.length > 12) return;
              setUsername(e.target.value);
            }}
          />
          {!playerExists && (
            <InfoBox
              content={tl('generator.settings.player_not_found')}
              style={'severe'}
            />
          )}
        </div>
        <div className={'setting flex'}>
          <div>
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
          <div>
            <p>{tl('generator.settings.widget_language')}</p>
            <select
              value={settings.widgetLanguage?.id}
              onChange={(event) => {
                if (event.target.value === 'default') {
                  setWidgetLanguage(undefined);
                  return;
                }
                const language =
                  languages.find(
                    (language) => language.id === event.target.value
                  ) || languages[0];
                setWidgetLanguage(language);
              }}
            >
              <option key={'default'} value={'default'}>
                {tl('generator.settings.widget_language.default')}
              </option>
              {languages.map((language) => {
                return (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                );
              })}
            </select>
          </div>
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
      </div>
      <div className={'settings'}>
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
          <button
            onClick={() => {
              setSelectedTabIndex(1);
            }}
            style={{ marginTop: '12px' }}
          >
            {tl('generator.settings.adjust_style')}
          </button>
        </div>
      </div>
      <div className={'settings'}>
        <div className={'setting'}>
          <Checkbox
            text={tl('generator.settings.auto_width')}
            state={settings.autoWidth}
            setState={setAutoWidth}
            helpTitle={tl('generator.settings.auto_width.help')}
          />
          <Checkbox
            text={tl('generator.settings.save_session')}
            state={settings.saveSession}
            setState={setSaveSession}
            experimental={true}
            helpTitle={tl('generator.settings.save_session.help')}
          />
          <Checkbox
            text={tl('generator.settings.only_official_matches')}
            state={settings.onlyOfficialMatchesCount}
            setState={setOnlyOfficialMatchesCount}
          />
        </div>
      </div>
      <hr />
      <p style={{ marginTop: '16px' }} className={'subtext'}>
        {tl('generator.description')}
      </p>
    </>
  );
};
