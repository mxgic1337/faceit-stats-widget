import { Language, languages } from '../../translations/translations.ts';
import { Checkbox } from '../../components/Checkbox.tsx';
import { Dispatch, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import { InfoBox } from '../../components/InfoBox.tsx';
import { ShowRanking } from '../../../widget/src/widget/Widget.tsx';
import { UserIcon } from '../../assets/icons/tabler/UserIcon.tsx';
import { HelpIcon } from '../../assets/icons/tabler/HelpIcon.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';

type Props = {
  playerExists: boolean | undefined;
  username: string;
  playerAvatar?: string;
  language: Language;
  setLanguage: Dispatch<Language>;
  setUsername: Dispatch<string>;
  setSelectedTabIndex: Dispatch<number>;
};

export const MainTab = ({
  playerExists,
  playerAvatar,
  username,
  language,
  setLanguage,
  setUsername,
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
            <div className={'title'}>
              {tl('generator.settings.show_ranking')}{' '}
              <div className={'badge help'}>
                <Tooltip
                  content={
                    <>
                      <p> {tl('generator.settings.show_ranking.help.0')}</p>
                      <br />
                      <p>
                        {' '}
                        {tl('generator.settings.show_ranking.help.1')}{' '}
                        <a href="https://flagpedia.net">flagpedia.net</a>
                      </p>
                    </>
                  }
                >
                  <HelpIcon />
                </Tooltip>
              </div>
            </div>
            <select
              value={settings.get('showRanking')}
              onChange={(e) =>
                settings.set('showRanking', e.target.value as ShowRanking)
              }
            >
              {Object.entries(ShowRanking).map(([key, value]) => {
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
            helpTitle={tl('generator.settings.auto_width.help')}
          />
          <Checkbox
            text={tl('generator.settings.save_session')}
            setting={'saveSession'}
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
