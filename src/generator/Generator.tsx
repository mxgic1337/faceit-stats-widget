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
import { getPlayerProfile } from '../../widget/src/utils/faceit_util.ts';
import { MainTab } from './tabs/MainTab.tsx';
import { StyleTab } from './tabs/StyleTab.tsx';
import { StatisticsTab, StatisticType } from './tabs/StatisticsTab.tsx';
import { GeneratedWidgetModal } from '../components/GeneratedWidgetModal.tsx';
import { InfoBox } from '../components/InfoBox.tsx';
import { Footer } from '../components/Footer.tsx';
import nukePreview from '../assets/previews/nuke.png';
import miragePreview from '../assets/previews/mirage.png';
import ancientPreview from '../assets/previews/ancient.png';
import { useSearchParams } from 'react-router-dom';

interface Settings {
  customCSS: string;
  autoWidth: boolean;
  username: string;
  playerId: string | undefined;
  playerElo: number;
  playerLevel: number;
  playerBanner: string | undefined;
  onlyOfficialMatchesCount: boolean;
  showRanking: boolean;
  showRankingOnlyWhenChallenger: boolean;
  showEloDiff: boolean;
  showUsername: boolean;
  showEloSuffix: boolean;
  showStatistics: boolean;
  showEloProgressBar: boolean;
  useBannerAsBackground: boolean;
  adjustBackgroundOpacity: boolean;
  backgroundOpacity: number;
  refreshInterval: number;
  colorScheme: string;
  style: string;
  customBorderColor1: string;
  customBorderColor2: string;
  customTextColor: string;
  customBackgroundColor: string;
  language: Language;
  widgetLanguage: Language | undefined;
  statSlot1: StatisticType;
  statSlot2: StatisticType;
  statSlot3: StatisticType;
  statSlot4: StatisticType;
  saveSession: boolean;
  averageStatsMatchCount: number;
  widgetOpacity: number;
}

export const LanguageContext = createContext<
  ((text: string, args?: string[]) => string) | null
>(null);
export const SettingsContext = createContext<Settings | null>(null);
export const Generator = () => {
  const [playerExists, setPlayerExists] = useState<boolean>(true);
  const [customCSS, setCustomCSS] = useState<string>('https://example.com');
  const [generatedURL, setGeneratedURL] = useState<string | undefined>();
  const [autoWidth, setAutoWidth] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('paszaBiceps');
  const [playerId, setPlayerId] = useState<string>();
  const [playerElo, setPlayerElo] = useState<number>(100);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [playerBanner, setPlayerBanner] = useState<string | undefined>();
  const [onlyOfficialMatchesCount, setOnlyOfficialMatchesCount] =
    useState<boolean>(true);
  const [showRanking, setShowRanking] = useState<boolean>(true);
  const [showRankingOnlyWhenChallenger, setShowRankingOnlyWhenChallenger] =
    useState<boolean>(true);
  const [showEloDiff, setShowEloDiff] = useState<boolean>(true);
  const [showUsername, setShowUsername] = useState<boolean>(true);
  const [showEloSuffix, setShowEloSuffix] = useState<boolean>(true);
  const [showStatistics, setShowStatistics] = useState<boolean>(true);
  const [showEloProgressBar, setShowEloProgressBar] = useState<boolean>(true);
  const [useBannerAsBackground, setUseBannerAsBackground] =
    useState<boolean>(true);
  const [adjustBackgroundOpacity, setAdjustBackgroundOpacity] =
    useState<boolean>(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(0.15);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [averageStatsMatchCount, setAverageStatsMatchCount] =
    useState<number>(30);
  const [colorScheme, setColorScheme] = useState<string>('dark');
  const [style, setStyle] = useState<string>('normal');
  const [searchParams] = useSearchParams();
  const [widgetOpacity, setWidgetOpacity] = useState<number>(1);
  const [language, setLanguage] = useState<Language>(
    languages.find((language) => language.id === searchParams.get('lang')) ||
      languages.find((language) => language.id === localStorage.fcw_lang) ||
      languages.find((language) => language.id === navigator.language) ||
      languages[0]
  );
  const [previewBackground, setPreviewBackground] = useState<string>('ancient');
  const [widgetLanguage, setWidgetLanguage] = useState<Language | undefined>();
  const [saveSession, setSaveSession] = useState<boolean>(false);

  const [customBorderColor1, setCustomBorderColor1] =
    useState<string>('#595959');
  const [customBorderColor2, setCustomBorderColor2] =
    useState<string>('#8d8d8d');
  const [customTextColor, setCustomTextColor] = useState<string>('#ffffff');
  const [customBackgroundColor, setCustomBackgroundColor] =
    useState<string>('#121212');

  const [statSlot1, setStatSlot1] = useState<StatisticType>(
    StatisticType.KILLS
  );
  const [statSlot2, setStatSlot2] = useState<StatisticType>(StatisticType.KD);
  const [statSlot3, setStatSlot3] = useState<StatisticType>(
    StatisticType.HSPERCENT
  );
  const [statSlot4, setStatSlot4] = useState<StatisticType>(
    StatisticType.WINRATIO
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tl = useCallback(
    (text: string, args?: string[]) => {
      return translate(language, text, args);
    },
    [language]
  );

  useLayoutEffect(() => {
    const description = document.getElementsByName('description');
    (description[0] as HTMLMetaElement).content = tl('meta.description');
  }, [language]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getPlayerProfile(username).then((res) => {
        if (res && res.games.cs2) {
          setPlayerId(res.player_id);
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

  useEffect(() => {
    document.getElementsByTagName('html')[0].classList.add(`generator`);
    return () => {
      document.getElementsByTagName('html')[0].classList.remove(`generator`);
    };
  }, []);

  const generateWidgetURL = useCallback(() => {
    let params: {
      [key: string]:
        | string
        | (string | undefined)
        | number
        | boolean
        | string[];
    } = {
      player_id: playerId,
      lang: widgetLanguage ? widgetLanguage.id : language.id,
      progress: showEloProgressBar,
      avg: showStatistics,
      suffix: showEloSuffix,
      diff: showEloDiff,
      scheme: colorScheme,
      style,
      opacity: widgetOpacity,
      ranking: showRanking ? (showRankingOnlyWhenChallenger ? 2 : 1) : 0,
      banner: useBannerAsBackground,
      refresh: refreshInterval,
      name: showUsername,
      auto_width: autoWidth,
      only_official: onlyOfficialMatchesCount,
      stats: [statSlot1, statSlot2, statSlot3, statSlot4],
      save_session: saveSession,
      avg_matches: averageStatsMatchCount,
    };

    if (useBannerAsBackground && adjustBackgroundOpacity) {
      params = {
        ...params,
        banner_opacity: backgroundOpacity,
      };
    }

    if (style === 'custom') {
      params = {
        ...params,
        css: customCSS,
      };
    }

    if (colorScheme === 'custom') {
      params = {
        ...params,
        color: customTextColor.substring(1),
        'bg-color': customBackgroundColor.substring(1),
        border1: customBorderColor1.substring(1),
        border2: customBorderColor2.substring(1),
      };
    }

    setGeneratedURL(
      `${window.location.protocol}//${window.location.host}/widget/${jsonToQuery(params)}`
    );
  }, [
    customBackgroundColor,
    customBorderColor1,
    customBorderColor2,
    customCSS,
    customTextColor,
    language,
    widgetLanguage,
    showStatistics,
    showEloDiff,
    showEloProgressBar,
    showEloSuffix,
    showRanking,
    showRankingOnlyWhenChallenger,
    style,
    username,
    playerId,
    playerBanner,
    colorScheme,
    useBannerAsBackground,
    adjustBackgroundOpacity,
    backgroundOpacity,
    refreshInterval,
    showUsername,
    autoWidth,
    onlyOfficialMatchesCount,
    statSlot1,
    statSlot2,
    statSlot3,
    statSlot4,
    saveSession,
    averageStatsMatchCount,
    widgetOpacity,
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
          setUsername={setUsername}
          setPlayerId={setPlayerId}
          setPlayerBanner={setPlayerBanner}
          setAutoWidth={setAutoWidth}
          setShowUsername={setShowUsername}
          setLanguage={setLanguage}
          setWidgetLanguage={setWidgetLanguage}
          setShowEloSuffix={setShowEloSuffix}
          setShowStatistics={setShowStatistics}
          setShowRanking={setShowRanking}
          setShowEloProgressBar={setShowEloProgressBar}
          setShowEloDiff={setShowEloDiff}
          setShowRankingOnlyWhenChallenger={setShowRankingOnlyWhenChallenger}
          setRefreshInterval={setRefreshInterval}
          setOnlyOfficialMatchesCount={setOnlyOfficialMatchesCount}
          setSaveSession={setSaveSession}
          setSelectedTabIndex={setSelectedTabIndex}
        />
      ),
    },
    {
      name: tl('generator.theme.title'),
      component: (
        <StyleTab
          key={'style'}
          setCustomBorderColor1={setCustomBorderColor1}
          setCustomBorderColor2={setCustomBorderColor2}
          setCustomBackgroundColor={setCustomBackgroundColor}
          setCustomTextColor={setCustomTextColor}
          setCustomCSS={setCustomCSS}
          setStyle={setStyle}
          setUseBannerAsBackground={setUseBannerAsBackground}
          setAdjustBackgroundOpacity={setAdjustBackgroundOpacity}
          setBackgroundOpacity={setBackgroundOpacity}
          setColorScheme={setColorScheme}
          setWidgetOpacity={setWidgetOpacity}
        />
      ),
    },
    {
      name: tl('generator.stats.title'),
      component: (
        <StatisticsTab
          key={'stats'}
          setStatSlot1={setStatSlot1}
          setStatSlot2={setStatSlot2}
          setStatSlot3={setStatSlot3}
          setStatSlot4={setStatSlot4}
          setAverageStatsMatchCount={setAverageStatsMatchCount}
        />
      ),
    },
  ];

  const previews = useMemo<string[]>(() => {
    return ['nuke', 'mirage', 'ancient'];
  }, []);

  return (
    <LanguageContext.Provider value={tl}>
      <SettingsContext.Provider
        value={{
          customCSS,
          autoWidth,
          username,
          playerId,
          playerElo,
          playerLevel,
          playerBanner,
          onlyOfficialMatchesCount,
          showRanking,
          showRankingOnlyWhenChallenger,
          showEloDiff,
          showEloSuffix,
          showUsername,
          showStatistics,
          showEloProgressBar,
          useBannerAsBackground,
          adjustBackgroundOpacity,
          backgroundOpacity,
          refreshInterval,
          colorScheme,
          style: style,
          language,
          widgetLanguage,
          statSlot1,
          statSlot2,
          statSlot3,
          statSlot4,
          customTextColor,
          customBackgroundColor,
          customBorderColor1,
          customBorderColor2,
          saveSession,
          averageStatsMatchCount,
          widgetOpacity,
        }}
      >
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
                className={`${style}-theme ${colorScheme}-scheme preview ${previewBackground}`}
              >
                {(style !== 'custom' ||
                  (style === 'custom' &&
                    customCSS !== 'https://example.com')) && (
                  <Widget preview={true} />
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
