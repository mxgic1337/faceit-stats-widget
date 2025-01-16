import { createContext, useCallback, useEffect, useState } from 'react';
import { Widget } from '../../widget/src/widget/Widget.tsx';
import { Separator } from '../components/generator/Separator.tsx';
import { Language, languages, tl } from '../translations/translations.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getPlayerID,
  getPlayerProfile,
  SAMPLE_PLAYER_ID,
} from '../../widget/src/utils/faceit_util.ts';
import { MainTab } from './tabs/MainTab.tsx';
import { StyleTab } from './tabs/StyleTab.tsx';
import { StatisticsTab, StatisticType } from './tabs/StatisticsTab.tsx';
import { GeneratedWidgetModal } from '../components/generator/GeneratedWidgetModal.tsx';
import { InfoBox } from '../components/generator/InfoBox.tsx';
import { Footer } from '../components/generator/Footer.tsx';

interface Settings {
  customCSS: string;
  autoWidth: boolean;
  username: string;
  playerId: string;
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
  theme: string;
  customBorderColor1: string;
  customBorderColor2: string;
  customTextColor: string;
  customBackgroundColor: string;
  language: Language;
  statSlot1: StatisticType;
  statSlot2: StatisticType;
  statSlot3: StatisticType;
  statSlot4: StatisticType;
  saveSession: boolean;
}

export const LanguageContext = createContext<
  ((text: string, args?: string[]) => string) | null
>(null);
export const SettingsContext = createContext<Settings | null>(null);
export const Generator = () => {
  const [customCSS, setCustomCSS] = useState<string>('https://example.com');
  const [generatedURL, setGeneratedURL] = useState<string | undefined>();
  const [autoWidth, setAutoWidth] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>(SAMPLE_PLAYER_ID);
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
    useState<boolean>(false);
  const [adjustBackgroundOpacity, setAdjustBackgroundOpacity] =
    useState<boolean>(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(0.15);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [colorScheme, setColorScheme] = useState<string>('dark');
  const [theme, setTheme] = useState<string>('normal');
  const [language, setLanguage] = useState<Language>(
    languages.find((language) => language.id === localStorage.fcw_lang) ||
      languages[0]
  );
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

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const translate = useCallback(
    (text: string, args?: string[]) => {
      return tl(language, text, args);
    },
    [language]
  );

  useEffect(() => {
    getPlayerProfile(SAMPLE_PLAYER_ID).then((res) => {
      if (res) {
        setUsername(res.nickname);
        setPlayerBanner(res.cover_image);
      } else {
        alert(tl('generator.alert.player_not_found', ['?']));
      }
    });
  }, []);

  useEffect(() => {
    document.getElementsByTagName('html')[0].classList.add(`generator`);
    return () => {
      document.getElementsByTagName('html')[0].classList.remove(`generator`);
    };
  }, []);

  useEffect(() => {
    if (!searchParams.get('lang')) navigate(`?lang=${language.id}`);
  }, []);

  const generateWidgetURL = useCallback(() => {
    let params: { [key: string]: string | number | boolean | string[] } = {
      player_id: playerId,
      lang: language.id,
      progress: showEloProgressBar,
      avg: showStatistics,
      suffix: showEloSuffix,
      diff: showEloDiff,
      scheme: colorScheme,
      theme: theme,
      ranking: showRanking ? (showRankingOnlyWhenChallenger ? 2 : 1) : 0,
      banner: useBannerAsBackground,
      refresh: refreshInterval,
      name: showUsername,
      auto_width: autoWidth,
      only_official: onlyOfficialMatchesCount,
      stats: [statSlot1, statSlot2, statSlot3, statSlot4],
      save_session: saveSession,
    };

    if (useBannerAsBackground && adjustBackgroundOpacity) {
      params = {
        ...params,
        banner_opacity: backgroundOpacity,
      };
    }

    if (theme === 'custom') {
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
    showStatistics,
    showEloDiff,
    showEloProgressBar,
    showEloSuffix,
    showRanking,
    showRankingOnlyWhenChallenger,
    theme,
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
  ]);

  const jsonToQuery = useCallback(
    (params: { [key: string]: string | number | boolean | string[] }) => {
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
      name: tl(language, 'generator.settings.title'),
      component: (
        <MainTab
          key={'main'}
          setUsername={setUsername}
          setPlayerId={setPlayerId}
          setPlayerBanner={setPlayerBanner}
          setAutoWidth={setAutoWidth}
          setShowUsername={setShowUsername}
          setLanguage={setLanguage}
          setShowEloSuffix={setShowEloSuffix}
          setShowStatistics={setShowStatistics}
          setShowRanking={setShowRanking}
          setShowEloProgressBar={setShowEloProgressBar}
          setShowEloDiff={setShowEloDiff}
          setShowRankingOnlyWhenChallenger={setShowRankingOnlyWhenChallenger}
          setRefreshInterval={setRefreshInterval}
          setOnlyOfficialMatchesCount={setOnlyOfficialMatchesCount}
          setSaveSession={setSaveSession}
        />
      ),
    },
    {
      name: tl(language, 'generator.theme.title'),
      component: (
        <StyleTab
          key={'style'}
          setCustomBorderColor1={setCustomBorderColor1}
          setCustomBorderColor2={setCustomBorderColor2}
          setCustomBackgroundColor={setCustomBackgroundColor}
          setCustomTextColor={setCustomTextColor}
          setCustomCSS={setCustomCSS}
          setTheme={setTheme}
          setUseBannerAsBackground={setUseBannerAsBackground}
          setAdjustBackgroundOpacity={setAdjustBackgroundOpacity}
          setBackgroundOpacity={setBackgroundOpacity}
          setColorScheme={setColorScheme}
        />
      ),
    },
    {
      name: tl(language, 'generator.stats.title'),
      component: (
        <StatisticsTab
          key={'stats'}
          setStatSlot1={setStatSlot1}
          setStatSlot2={setStatSlot2}
          setStatSlot3={setStatSlot3}
          setStatSlot4={setStatSlot4}
        />
      ),
    },
  ];

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <LanguageContext.Provider value={translate}>
      <SettingsContext.Provider
        value={{
          customCSS,
          autoWidth,
          username,
          playerId,
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
          theme,
          language,
          statSlot1,
          statSlot2,
          statSlot3,
          statSlot4,
          customTextColor,
          customBackgroundColor,
          customBorderColor1,
          customBorderColor2,
          saveSession,
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
              content={<p>{tl(language, 'generator.testing')}</p>}
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
            <Separator text={tl(language, 'generator.preview.title')} />
            <div className={`${theme}-theme ${colorScheme}-scheme preview`}>
              <Widget preview={true} />
            </div>
            <div className={'flex'}>
              <button
                onClick={() => {
                  generateWidgetURL();
                }}
              >
                {tl(language, 'generator.generate.button')}
              </button>
            </div>
          </section>
        </main>
      </SettingsContext.Provider>
    </LanguageContext.Provider>
  );
};
