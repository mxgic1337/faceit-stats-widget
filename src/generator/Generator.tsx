import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Widget } from '../../widget/src/widget/Widget.tsx';
import {
  Language,
  languages,
  tl as translate,
} from '../translations/translations.ts';
import { MainTab } from './tabs/MainTab.tsx';
import { StyleTab } from './tabs/StyleTab.tsx';
import { StatisticsTab } from './tabs/StatisticsTab.tsx';
import { GeneratedWidgetModal } from '../components/GeneratedWidgetModal.tsx';
import { InfoBox } from '../components/InfoBox.tsx';
import { Footer } from '../components/Footer.tsx';
import nukePreview from '../assets/previews/nuke.png';
import miragePreview from '../assets/previews/mirage.png';
import ancientPreview from '../assets/previews/ancient.png';
import dust2Preview from '../assets/previews/dust2.png';
import infernoPreview from '../assets/previews/inferno.png';
import overpassPreview from '../assets/previews/overpass.png';
import vertigoPreview from '../assets/previews/vertigo.png';
import trainPreview from '../assets/previews/train.png';
import anubisPreview from '../assets/previews/anubis.png';
import { useSearchParams } from 'react-router-dom';
import {
  SetSettingFunction,
  SettingDefinition,
  SettingKey,
  Settings,
  SettingValueType,
  useSettings,
} from '../settings/manager.ts';
import { SETTINGS_DEFINITIONS } from '../settings/definition.ts';
import { RestoreSettingsModal } from '../components/RestoreSettingsModal.tsx';
import { getPlayerProfile } from '../../widget/src/utils/faceit_util.ts';

export const LanguageContext = createContext<
  ((text: string, args?: string[]) => string) | null
>(null);
export const SettingsContext = createContext<{
  settings: Settings;
  get: <K extends SettingKey>(key: K) => SettingValueType<K>;
  set: SetSettingFunction;
} | null>(null);
export const Generator = () => {
  const [playerExists, setPlayerExists] = useState<boolean>(true);
  const [generatedURL, setGeneratedURL] = useState<string | undefined>();
  const [username, setUsername] = useState<string>(
    localStorage.getItem('fcw_generator_username') || 'paszaBiceps'
  );
  const [playerElo, setPlayerElo] = useState<number>(100);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [playerAvatar, setPlayerAvatar] = useState<string | undefined>();
  const [playerBanner, setPlayerBanner] = useState<string | undefined>();
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState<Language>(
    languages.find((language) => language.id === searchParams.get('lang')) ||
      languages.find((language) => language.id === localStorage.fcw_lang) ||
      languages.find((language) => language.id === navigator.language) ||
      languages[0]
  );
  const [previewBackground, setPreviewBackground] = useState<string>('ancient');

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [restoreSettingsModalOpen, setRestoreSettingsModalOpen] =
    useState(false);

  const tl = useCallback(
    (text: string, args?: string[]) => {
      return translate(language, text, args);
    },
    [language]
  );

  const {
    settings,
    getSetting,
    setSetting,
    restoreDefaults,
    saveSettingsToLocalStorage,
  } = useSettings(false, true);

  useLayoutEffect(() => {
    const description = document.getElementsByName('description');
    (description[0] as HTMLMetaElement).content = tl('meta.description');
  }, [language]);

  useEffect(() => {
    document.getElementsByTagName('html')[0].classList.add(`generator`);
    return () => {
      document.getElementsByTagName('html')[0].classList.remove(`generator`);
    };
  }, []);

  useEffect(() => {
    if (!settings || !tl) return;
    const timeout = setTimeout(() => {
      getPlayerProfile(username).then((res) => {
        if (res && res.games.cs2) {
          setSetting('playerId', res.player_id);
          setPlayerAvatar(res.avatar);
          setPlayerBanner(res.cover_image);
          setPlayerElo(res.games.cs2.faceit_elo);
          setPlayerLevel(res.games.cs2.skill_level);
          setPlayerExists(true);
          console.log(`Fetched ${res.nickname}'s profile`);
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

  const jsonToQuery = useCallback(
    (params: {
      [key: string]:
        | string
        | (string | undefined)
        | number
        | boolean
        | string[];
    }) => {
      return `?${Object.entries(params)
        .map((param) => {
          return `${param[0]}=${param[1]}`;
        })
        .join('&')}`;
    },
    []
  );

  const generateWidgetURL = useCallback(() => {
    const params: {
      [key: string]:
        | string
        | (string | undefined)
        | number
        | boolean
        | string[];
    } = {};

    Object.entries(SETTINGS_DEFINITIONS).forEach(
      ([setting, definition]: [string, SettingDefinition]) => {
        if (!definition.query || definition.query.length === 0) return;
        if (definition.requirements && definition.requirements.length !== 0) {
          for (const requirement of definition.requirements) {
            if (
              getSetting(requirement.setting as SettingKey) !==
              requirement.value
            )
              return;
          }
        }
        if (getSetting(setting) === undefined) return;
        params[definition.query[0]] = getSetting(setting);
      }
    );

    if (!params.lang) {
      params.lang = language.id;
    }

    params.stats = [
      settings.statSlot1,
      settings.statSlot2,
      settings.statSlot3,
      settings.statSlot4,
    ].toString();

    setGeneratedURL(
      `${window.location.protocol}//${window.location.host}/widget/${jsonToQuery(params)}`
    );

    saveSettingsToLocalStorage();
    localStorage.setItem('fcw_generator_username', username);
  }, [settings, getSetting, language, saveSettingsToLocalStorage, username]);

  const tabs = [
    {
      name: tl('generator.settings.title'),
      component: (
        <MainTab
          key={'main'}
          playerExists={playerExists}
          username={username}
          playerAvatar={playerAvatar}
          language={language}
          setUsername={setUsername}
          setLanguage={setLanguage}
          setSelectedTabIndex={setSelectedTabIndex}
        />
      ),
    },
    {
      name: tl('generator.theme.title'),
      component: (
        <StyleTab
          key={'style'}
          username={username}
          playerBanner={playerBanner}
        />
      ),
    },
    {
      name: tl('generator.stats.title'),
      component: <StatisticsTab key={'stats'} />,
    },
  ];

  const previews = useMemo<string[]>(() => {
    const previewArray = [
      'nuke',
      'mirage',
      'ancient',
      'dust2',
      'inferno',
      'overpass',
      'vertigo',
      'train',
      'anubis',
    ];
    if (import.meta.env.DEV) previewArray.push('color-green');
    return previewArray;
  }, []);

  return (
    <LanguageContext.Provider value={tl}>
      <SettingsContext.Provider
        value={{ settings, get: getSetting, set: setSetting }}
      >
        <GeneratedWidgetModal
          language={language}
          url={generatedURL}
          setURL={setGeneratedURL}
        />
        <RestoreSettingsModal
          open={restoreSettingsModalOpen}
          setOpen={setRestoreSettingsModalOpen}
          setUsername={setUsername}
          restoreDefaults={restoreDefaults}
        />
        <header>
          {import.meta.env.DEV && !import.meta.env.VITE_FACEIT_API_KEY && (
            <InfoBox
              content={
                <p>
                  Warning: <b>VITE_FACEIT_API_KEY</b> environment variable is
                  not set.
                </p>
              }
              style={'warn'}
            />
          )}
          {import.meta.env.VITE_IS_TESTING && (
            <InfoBox
              content={
                <p>
                  {tl('generator.testing')}{' '}
                  <a href="https://widget.mxgic1337.xyz">
                    {tl('generator.testing.stable')}
                  </a>
                </p>
              }
              style={'info'}
            />
          )}
          <nav>
            {tabs.map((tab, index) => {
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setSelectedTabIndex(index);
                  }}
                  className={index === selectedTabIndex ? 'active' : ''}
                >
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </header>
        <main>
          <section className={'fixed-width'}>
            {tabs[selectedTabIndex].component}
            <br />
            <Footer />
          </section>
          <section className={'preview'}>
            <div className={'settings'}>
              <h4 style={{ marginBottom: '6px' }}>
                {translate(language, 'generator.preview.title')}
              </h4>
              <style>{`
		      div.preview.nuke {--preview-background: url(${nukePreview})}
		      div.preview.mirage {--preview-background: url(${miragePreview})}
		      div.preview.ancient {--preview-background: url(${ancientPreview})}
		      div.preview.dust2 {--preview-background: url(${dust2Preview})}
		      div.preview.inferno {--preview-background: url(${infernoPreview})}
		      div.preview.overpass {--preview-background: url(${overpassPreview})}
		      div.preview.vertigo {--preview-background: url(${vertigoPreview})}
		      div.preview.train {--preview-background: url(${trainPreview})}
		      div.preview.anubis {--preview-background: url(${anubisPreview})}
		      div.preview.color-green {--preview-background: #00ff00}
		      `}</style>
              <div
                className={`${getSetting('style')}-theme ${getSetting('colorScheme')}-scheme preview ${previewBackground}`}
              >
                {(getSetting('style') !== 'custom' ||
                  (getSetting('style') === 'custom' &&
                    getSetting('customCSS') !== 'https://example.com')) && (
                  <Widget
                    preview={true}
                    previewBanner={playerBanner}
                    previewUsername={username}
                    previewElo={playerElo}
                    previewLevel={playerLevel}
                    previewLanguage={language}
                  />
                )}
              </div>
              <select
                value={previewBackground}
                onChange={(e) => {
                  setPreviewBackground(e.target.value);
                }}
              >
                {previews.map((preview) => {
                  return (
                    <option key={preview} value={preview}>
                      {tl(`generator.preview.${preview}`)}
                    </option>
                  );
                })}
              </select>
              <div className={'flex'}>
                <button
                  onClick={() => {
                    generateWidgetURL();
                  }}
                >
                  {tl('generator.generate.button')}
                </button>
              </div>
              <hr />
              <button
                onClick={() => {
                  setRestoreSettingsModalOpen(true);
                }}
              >
                {tl('generator.restore_defaults.button')}
              </button>
            </div>
          </section>
        </main>
      </SettingsContext.Provider>
    </LanguageContext.Provider>
  );
};
