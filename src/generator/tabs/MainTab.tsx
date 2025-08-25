import { Language, languages } from '../../translations/translations.ts';
import { Checkbox } from '../../components/Checkbox.tsx';
import { Dispatch, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import { InfoBox } from '../../components/InfoBox.tsx';
import { getPlayerProfile } from '../../../widget/src/utils/faceit_util.ts';
import { ShowRanking } from '../../../widget/src/widget/Widget.tsx';

type Props = {
  playerExists: boolean | undefined;
  username: string;
  language: Language;
  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setPlayerElo: Dispatch<number>;
  setPlayerLevel: Dispatch<number>;
  setPlayerBanner: Dispatch<string | undefined>;
  setPlayerExists: Dispatch<boolean>;
  setSelectedTabIndex: Dispatch<number>;
};

export const MainTab = ({
  playerExists,
  username,
  language,
  setLanguage,
  setUsername,
  setPlayerElo,
  setPlayerLevel,
  setPlayerBanner,
  setPlayerExists,
  setSelectedTabIndex,
}: Props) => {
  const navigate = useNavigate();
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);

  useEffect(() => {
    if (!settings || !tl) return;
    const timeout = setTimeout(() => {
      getPlayerProfile(username).then((res) => {
        if (res && res.games.cs2) {
          settings.set('playerId', res.player_id);
          setPlayerBanner(res.cover_image);
          setPlayerElo(res.games.cs2.faceit_elo);
          setPlayerLevel(res.games.cs2.skill_level);
          setPlayerExists(true);
        } else {
          setPlayerElo(100);
          setPlayerLevel(1);
          setPlayerExists(false);
        }
      });
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [username]);

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
            value={username}
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
              value={language.id}
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
              value={settings.get('widgetLanguage') as string | undefined}
              onChange={(event) => {
                if (event.target.value === 'default') {
                  settings.set('widgetLanguage', undefined);
                  return;
                }
                const language =
                  languages.find(
                    (language) => language.id === event.target.value
                  ) || languages[0];
                settings.set('widgetLanguage', language.id);
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
            value={settings.get('refreshInterval')}
            onChange={(event) => {
              settings.set(
                'refreshInterval',
                parseInt(event.currentTarget.value)
              );
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
            setting={'showUsername'}
          />
          <Checkbox
            text={tl('generator.settings.show_elo_suffix')}
            setting={'showEloSuffix'}
          />
          <Checkbox
            text={tl('generator.settings.show_elo_diff')}
            setting={'showEloDiff'}
          />
          <Checkbox
            text={tl('generator.settings.show_elo_progress_bar')}
            setting={'showEloProgressBar'}
          />
          <Checkbox
            text={tl('generator.settings.show_kd')}
            setting={'showStatistics'}
          />
          <div className={'setting'}>
            <p>{tl('generator.settings.show_ranking')}</p>
            <select
              value={settings.get('showRanking')}
              onChange={(e) =>
                settings.set(
                  'showRanking',
                  parseInt(e.target.value) as ShowRanking
                )
              }
            >
              {Object.entries(ShowRanking).map(([key, value]) => {
                if (typeof value !== 'number') return;
                return (
                  <option key={key} value={value}>
                    {tl(`ranking_state.${key}`)}{' '}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => {
              setSelectedTabIndex(1);
            }}
          >
            {tl('generator.settings.adjust_style')}
          </button>
        </div>
      </div>
      <div className={'settings'}>
        <div className={'setting'}>
          <Checkbox
            text={tl('generator.settings.auto_width')}
            setting={'autoWidth'}
          />
          <Checkbox
            text={tl('generator.settings.save_session')}
            setting={'saveSession'}
            experimental={true}
            helpTitle={tl('generator.settings.save_session.help')}
          />
          <Checkbox
            text={tl('generator.settings.only_official_matches')}
            setting={'onlyOfficialMatchesCount'}
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
