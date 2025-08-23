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
import { useSearchParams } from 'react-router-dom';
import { SetSettingFunction, SettingDefinition, SettingKey, Settings, SettingValueType, useSettings } from '../settings/manager.ts';
import { SETTINGS_DEFINITIONS } from '../settings/definition.ts';

export const LanguageContext = createContext<
  ((text: string, args?: string[]) => string) | null
>(null);
export const SettingsContext = createContext<{ settings: Settings, get: <K extends SettingKey>(key: K) => SettingValueType<K>, set: SetSettingFunction } | null>(null);
export const Generator = () => {
  const [playerExists, setPlayerExists] = useState<boolean>(true);
  const [generatedURL, setGeneratedURL] = useState<string | undefined>();
  const [username, setUsername] = useState<string>('paszaBiceps');
  const [playerElo, setPlayerElo] = useState<number>(100);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
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

  const tl = useCallback(
    (text: string, args?: string[]) => {
      return translate(language, text, args);
    },
    [language]
  );

  const { settings, getSetting, setSetting } = useSettings();

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
    console.log(settings, getSetting, setSetting)
  }, [settings, getSetting, setSetting])

  const generateWidgetURL = useCallback(() => {
    let params: {
      [key: string]:
      | string
      | (string | undefined)
      | number
      | boolean
      | string[];
    } = {};

    Object.entries(SETTINGS_DEFINITIONS).forEach(([setting, definition]: [string, SettingDefinition]) => {
      if (!definition.query || definition.query.length === 0) return;
      if (definition.requirements && definition.requirements.length !== 0) {
        for (const requirement of definition.requirements) {
          if (getSetting(requirement.setting as SettingKey) !== requirement.value) return;
        }
      }
      if (!getSetting(setting)) return;
      params[definition.query[0]] = getSetting(setting)
    })

    if (!params.lang) {
      params.lang = language.id;
    }

    params.stats = [settings.statSlot1, settings.statSlot2, settings.statSlot3, settings.statSlot4].toString()

    // TODO

    console.log(`Parameters:\n`, params)

    setGeneratedURL(
      `${window.location.protocol}//${window.location.host}/widget/${jsonToQuery(params)}`
    );
  }, [
    settings
  ]);

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

  const tabs = [
    {
      name: tl('generator.settings.title'),
      component: (
        <MainTab
          key={'main'}
          playerExists={playerExists}
          username={username}
          language={language}
          setUsername={setUsername}
          setPlayerElo={setPlayerElo}
          setPlayerLevel={setPlayerLevel}
          setPlayerBanner={setPlayerBanner}
          setPlayerExists={setPlayerExists}
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
      component: (
        <StatisticsTab
          key={'stats'}
        />
      ),
    },
  ];

  const previews = useMemo<string[]>(() => {
    return ['nuke', 'mirage', 'ancient'];
  }, []);

  return (
    <LanguageContext.Provider value={tl}>
      <SettingsContext.Provider value={{ settings, get: getSetting, set: setSetting }}>
        <GeneratedWidgetModal
          language={language}
          url={generatedURL}
          setURL={setGeneratedURL}
        />
        <header>
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
          <div className={'tabs'}>
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
          </div>
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
		      `}</style>
              <div
                className={`${getSetting('style')}-theme ${getSetting('colorScheme')}-scheme preview ${previewBackground}`}
              >
                {(getSetting('style') !== 'custom' ||
                  (getSetting('style') === 'custom' &&
                    getSetting('customCSS') !== 'https://example.com')) && (
                    <Widget preview={true} previewBanner={playerBanner} previewUsername={username} previewElo={playerElo} previewLevel={playerLevel} />
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
            </div>
          </section>
        </main>
      </SettingsContext.Provider>
    </LanguageContext.Provider>
  );
};
