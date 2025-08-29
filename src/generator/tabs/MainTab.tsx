import { Language, languages } from '../../translations/translations.ts';
import { Checkbox } from '../../components/Checkbox.tsx';
import { Dispatch, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import { InfoBox } from '../../components/InfoBox.tsx';
import { getPlayerProfile } from '../../../widget/src/utils/faceit_util.ts';
import { ShowRanking } from '../../../widget/src/widget/Widget.tsx';
import { UserIcon } from '../../assets/icons/tabler/UserIcon.tsx';

type Props = {
  playerExists: boolean | undefined;
  username: string;
  playerAvatar?: string;
  language: Language;
  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setPlayerElo: Dispatch<number>;
  setPlayerLevel: Dispatch<number>;
  setPlayerAvatar: Dispatch<string | undefined>;
  setPlayerBanner: Dispatch<string | undefined>;
  setPlayerExists: Dispatch<boolean>;
  setSelectedTabIndex: Dispatch<number>;
};

export const MainTab = ({
  playerExists,
  playerAvatar,
  username,
  language,
  setLanguage,
  setUsername,
  setPlayerElo,
  setPlayerLevel,
  setPlayerAvatar,
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
          setPlayerAvatar(res.avatar);
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
          <div className={'flex'}>
            {playerAvatar ? (
              <img src={playerAvatar} className={'player-avatar'} />
            ) : (
              <span className={'player-avatar empty'}>
                <UserIcon />
              </span>
            )}
            <div>
              <p>{tl('generator.settings.faceit_name')}</p>
              <input
                max={12}
                value={username}
                onChange={(e) => {
                  if (e.target.value.length > 12) return;
                  setUsername(e.target.value);
                }}
              />
            </div>
          </div>
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
            text={tl('generator.settings.show_icons')}
            setting={'showIcons'}
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
        </div>
      </div>
      <hr />
      <p style={{ marginTop: '16px' }} className={'subtext'}>
        {tl('generator.description')}
      </p>
    </>
  );
};
