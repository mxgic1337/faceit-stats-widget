import { Statistic } from '../components/Statistic.tsx';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  CSSProperties,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Language,
  languages,
  tl,
} from '../../../src/translations/translations.ts';
import {
  getPlayerID,
  getPlayerStats,
  SAMPLE_PLAYER_ID,
} from '../utils/faceit_util.ts';
import { Level1 } from '../components/levels/Level1.tsx';
import { Level2 } from '../components/levels/Level2.tsx';
import { Level3 } from '../components/levels/Level3.tsx';
import { Level4 } from '../components/levels/Level4.tsx';
import { Level5 } from '../components/levels/Level5.tsx';
import { Level6 } from '../components/levels/Level6.tsx';
import { Level7 } from '../components/levels/Level7.tsx';
import { Level8 } from '../components/levels/Level8.tsx';
import { Level9 } from '../components/levels/Level9.tsx';
import { Level10 } from '../components/levels/Level10.tsx';
import { Challenger } from '../components/levels/Challenger.tsx';

import { StatisticType } from '../../../src/generator/tabs/StatisticsTab.tsx';

import '../styles/themes/normal.less';
import '../styles/themes/compact.less';
import '../styles/themes/classic.less';

import '../styles/color_schemes.less';
import { SettingsContext } from '../../../src/generator/Generator.tsx';

export const styles: {
  id: string;
  hidden?: boolean;
  experimental?: boolean;
}[] = [
    { id: 'normal' },
    { id: 'compact' },
    { id: 'classic' },
    { id: 'custom', experimental: true, hidden: true },
  ];

export const colorSchemes: string[] = [
  'dark',
  'faceit',
  'ctp-latte',
  'ctp-frappe',
  'ctp-macchiato',
  'ctp-mocha',
  'custom',
];

const levelIcons = [
  <Level1 />,
  <Level2 />,
  <Level3 />,
  <Level4 />,
  <Level5 />,
  <Level6 />,
  <Level7 />,
  <Level8 />,
  <Level9 />,
  <Level10 />,
  <Challenger />,
  <Challenger />,
  <Challenger />,
  <Challenger />,
];

const eloDistribution = [
  ['#eee', 100, 500],
  ['#1CE400', 501, 750],
  ['#1CE400', 751, 900],
  ['#FFC800', 901, 1050],
  ['#FFC800', 1051, 1200],
  ['#FFC800', 1201, 1350],
  ['#FFC800', 1351, 1530],
  ['#FF6309', 1531, 1750],
  ['#FF6309', 1750, 2000],
  ['#FE1F00', 2001],
  ['#e80128', 2001] /* Challenger: 4-1000 */,
  ['#d9a441', 2001] /* Challenger: 1 */,
  ['#c7d0d5', 2001] /* Challenger: 2 */,
  ['#bf7145', 2001] /* Challenger: 3 */,
];

enum RankingState {
  DISABLED = 0,
  SHOW = 1,
  ONLY_WHEN_CHALLENGER = 2,
}

export const Widget = ({ preview }: { preview: boolean }) => {
  const [style, setStyle] = useState<string>();
  const [level, setLevel] = useState(1);
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [startingElo, setStartingElo] = useState<number>(100);
  const [elo, setElo] = useState(100);
  const [ranking, setRanking] = useState(1337);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [kdRatio, setKDRatio] = useState(0);
  const [hsPercent, setHSPercent] = useState(0);
  const [winsPercent, setWinsPercent] = useState(0);
  const [stats, setStats] = useState<StatisticType[]>([
    StatisticType.KILLS,
    StatisticType.KD,
    StatisticType.WINRATIO,
    StatisticType.HSPERCENT,
  ]);
  const [avgMatches, setAvgMatches] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [username, setUsername] = useState<string>();
  const [banner, setBanner] = useState<string>();
  const [showUsername, setShowUsername] = useState<boolean>(false);
  const [useBannerAsBackground, setUseBannerAsBackground] =
    useState<boolean>(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState<
    number | undefined
  >();
  const [currentEloDistribution, setCurrentEloDistribution] = useState<
    [number, (string | number)[]]
  >([1, eloDistribution[0]]);
  const [rankingState, setRankingState] = useState<RankingState>(0);

  const [customCSS, setCustomCSS] = useState<string | undefined>();

  const [showEloDiff, setShowEloDiff] = useState<boolean>();
  const [showEloSuffix, setShowEloSuffix] = useState<boolean>();
  const [showStatistics, setShowStatistics] = useState<boolean>();
  const [showEloProgressBar, setShowEloProgressBar] = useState<boolean>();

  const [customColorScheme, setCustomColorScheme] = useState<boolean>();
  const [customColor, setCustomColor] = useState<string>();
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>();
  const [customBorderColor, setCustomBorderColor] = useState<string>();
  const [customBorderColor2, setCustomBorderColor2] = useState<string>();

  const [widgetOpacity, setWidgetOpacity] = useState<number>(1);

  const [avgMatchCount, setAvgMatchCount] = useState<number>();
  const [compatibilityMode, setCompatibilityMode] = useState<boolean>();
  const overrides = useContext(SettingsContext);

  const translate = useCallback(
    (text: string, args?: string[]) => {
      return tl(language, text, args);
    },
    [language]
  );

  /* Apply settings from query params */
  useLayoutEffect(() => {
    if (preview) return;
    const languageParam = searchParams.get('lang');
    let styleParam = searchParams.get('style') || searchParams.get('theme');
    let colorSchemeParam = searchParams.get('scheme');
    const showUsernameParam = searchParams.get('name');
    const onlyOfficialParam = searchParams.get('only_official');
    const statsParam = searchParams.get('stats');
    const showEloDiffParam = searchParams.get('diff');
    const showEloSuffixParam = searchParams.get('suffix');
    const showStatisticsParam = searchParams.get('avg');
    const rankingParam = searchParams.get('ranking');
    const useBannerAsBackgroundParam = searchParams.get('banner');
    const backgroundOpacityParam = searchParams.get('banner_opacity');
    const autoWidthParam = searchParams.get('auto_width');
    const showEloProgressBarParam = searchParams.get('progress');
    const showEloProgressBarOldParam = searchParams.get('eloBar');
    const customCSSParam = searchParams.get('css');
    const avgMatchesParam = searchParams.get('avg_matches');
    const opacityParam = searchParams.get('opacity');

    const userAgent = window.navigator.userAgent;
    const chromeVersion = userAgent
      .split(' ')
      .find((version) => version.startsWith('Chrome/'));
    if (
      chromeVersion &&
      parseInt(chromeVersion.split('/')[1].split('.')[0]) < 120
    ) {
      setCompatibilityMode(true);
    }

    /* Redirect old theme format to new style & color scheme format */
    if (styleParam === 'dark' || styleParam === 'normal-custom') {
      styleParam = 'normal';
      colorSchemeParam = 'dark';
    } else if (
      (styleParam === 'compact' && !colorSchemeParam) ||
      styleParam === 'compact-custom'
    ) {
      styleParam = 'compact';
      if (styleParam === 'compact-custom') {
        colorSchemeParam = 'custom';
      } else {
        colorSchemeParam = 'dark';
      }
    } else if (styleParam === 'classic' && !colorSchemeParam) {
      colorSchemeParam = 'faceit';
    }

    if (statsParam) {
      setStats(statsParam.split(',') as StatisticType[]);
    }

    if (!onlyOfficialParam) {
      searchParams.set('only_official', 'true');
    }

    if (opacityParam) {
      setWidgetOpacity(parseFloat(opacityParam));
    }

    if (avgMatchesParam) {
      setAvgMatchCount(avgMatchesParam === '30' ? 30 : 20);
    } else {
      setAvgMatchCount(30);
    }

    setShowUsername(!showUsernameParam || showUsernameParam === 'true');
    setShowEloDiff(!showEloDiffParam || showEloDiffParam === 'true');
    setShowEloSuffix(!showEloSuffixParam || showEloSuffixParam === 'true');
    setShowStatistics(showStatisticsParam === 'true');
    setUseBannerAsBackground(useBannerAsBackgroundParam === 'true');
    setShowEloProgressBar(
      (showEloProgressBarParam || showEloProgressBarOldParam) === 'true'
    );

    if (rankingParam === '2') {
      setRankingState(RankingState.ONLY_WHEN_CHALLENGER);
    } else if (rankingParam === '1') {
      setRankingState(RankingState.SHOW);
    } else {
      setRankingState(RankingState.DISABLED);
    }

    if (backgroundOpacityParam) {
      setBackgroundOpacity(parseFloat(backgroundOpacityParam));
    }

    if (colorSchemeParam === 'custom') {
      setCustomColorScheme(true);
      setCustomColor(`#${searchParams.get('color')}`);
      setCustomBackgroundColor(`#${searchParams.get('bg-color')}`);
      setCustomBorderColor(`#${searchParams.get('border1')}`);
      setCustomBorderColor2(`#${searchParams.get('border2')}`);
    }

    let style = styleParam;
    let scheme = colorSchemeParam;

    if (!style || !styles.find((style1) => style1.id === style)) {
      style = 'normal';
    }
    if (!colorSchemes.find((scheme1) => scheme1 === scheme)) {
      scheme = 'dark';
    }

    if (style === 'custom' && customCSSParam) {
      setCustomCSS(customCSSParam);
    }

    setStyle(style);
    document.getElementsByTagName('html')[0].classList.add(`${style}-theme`);
    document.getElementsByTagName('html')[0].classList.add(`${scheme}-scheme`);
    if (autoWidthParam === 'true') {
      document.getElementsByTagName('html')[0].classList.add(`auto-width`);
    }

    const language = languages.find(
      (language) => language.id === languageParam
    );
    if (language) setLanguage(language);

    return () => {
      document
        .getElementsByTagName('html')[0]
        .classList.remove(`${style}-theme`);
      document
        .getElementsByTagName('html')[0]
        .classList.remove(`${scheme}-scheme`);
      if (autoWidthParam === 'true') {
        document.getElementsByTagName('html')[0].classList.remove(`auto-width`);
      }
    };
  }, []);

  /* Apply settings from preview */
  useLayoutEffect(() => {
    if (!preview || !overrides) return;
    setStats([
      overrides.statSlot1,
      overrides.statSlot2,
      overrides.statSlot3,
      overrides.statSlot4,
    ]);
    setShowUsername(overrides.showUsername as boolean);
    setElo(overrides.playerElo);
    setLevel(overrides.playerLevel);
    setCurrentEloDistribution(getEloDistribution(overrides.playerLevel, 1001));
    setShowEloDiff(overrides.showEloDiff as boolean);
    setShowEloSuffix(overrides.showEloSuffix as boolean);
    if (overrides.adjustBackgroundOpacity)
      setBackgroundOpacity(overrides.backgroundOpacity as number);
    else setBackgroundOpacity(undefined);
    setShowStatistics(overrides.showStatistics as boolean);
    setRankingState(
      overrides.showRanking ? RankingState.SHOW : RankingState.DISABLED
    );
    setUseBannerAsBackground(overrides.useBannerAsBackground as boolean);
    setLanguage(
      overrides.widgetLanguage ? overrides.widgetLanguage : overrides.language
    );
    setCustomColorScheme(overrides.colorScheme === 'custom');
    setCustomColor(overrides.customTextColor);
    setCustomBackgroundColor(overrides.customBackgroundColor);
    setCustomBorderColor(overrides.customBorderColor1);
    setCustomBorderColor2(overrides.customBorderColor2);
    setShowEloProgressBar(overrides.showEloProgressBar);
    setWidgetOpacity(overrides.widgetOpacity);
    setCustomCSS(overrides.customCSS);
    setStyle(overrides.style);
  }, [overrides]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /** Returns a path to a level icon */
  const getIcon = useCallback(() => {
    if (level === 10 && ranking <= 1000) {
      if (ranking === 1) return levelIcons[11];
      else if (ranking === 2) return levelIcons[12];
      else if (ranking === 3) return levelIcons[13];
      return levelIcons[10]; /* Challenger */
    }
    return levelIcons[level - 1];
  }, [level, ranking]);

  /** Returns a color, min ELO and max ELO of a level */
  const getEloDistribution = useCallback(
    (level: number, ranking: number): [number, (string | number)[]] => {
      if (level === 10 && ranking <= 1000) {
        if (ranking === 1) return [12, eloDistribution[11]];
        else if (ranking === 2) return [13, eloDistribution[12]];
        else if (ranking === 3) return [14, eloDistribution[13]];
        return [11, eloDistribution[10]]; /* Challenger */
      }
      return [level, eloDistribution[level - 1]];
    },
    [preview]
  );

  /* Update player stats */
  useEffect(() => {
    if (preview || !avgMatchCount) return;

    let startDate = new Date();
    const savedStartDate = localStorage.getItem('fcw_session_start');
    const savedPlayerId = localStorage.getItem('fcw_session_player-id');
    const saveSession = searchParams.get('save_session') === 'true';
    const playerId = searchParams.get('player_id');
    if (saveSession && savedStartDate && savedPlayerId === playerId) {
      console.log('Loaded starting date from session.');
      startDate = new Date(savedStartDate);
    }
    if (playerId === null) {
      const username = searchParams.get('player');
      if (username !== null) {
        getPlayerID(username).then((id) => {
          window.open(`${window.location}&player_id=${id}`, '_self');
        });
        return;
      }
      navigate(`?player_id=${SAMPLE_PLAYER_ID}`);
      return;
    }
    const getStats = (firstTime?: boolean) => {
      getPlayerStats(
        playerId,
        avgMatchCount,
        startDate,
        searchParams.get('only_official') === 'true'
      ).then((player) => {
        if (!player) return;
        setUsername(player.username);
        setBanner(player.banner);

        if (!player || !player.elo || !player.level) return;
        if (firstTime) {
          if (saveSession) {
            let expired = false;
            const sessionEnd = localStorage.getItem('fcw_session_end');
            const startingElo = localStorage.getItem(
              'fcw_session_starting-elo'
            );
            if (!sessionEnd) {
              expired = true;
            } else {
              const sessionEndDate = new Date(sessionEnd);
              if (new Date() > sessionEndDate) {
                expired = true;
              }
            }
            if (playerId !== savedPlayerId) {
              expired = true;
            }
            if (expired) {
              /* Save saved session data */
              console.log('Session expired. Saving new data...');
              localStorage.setItem(
                'fcw_session_starting-elo',
                String(player.elo)
              );
              localStorage.setItem('fcw_session_start', new Date().toString());
              localStorage.setItem('fcw_session_player-id', playerId);
            }
            const currentDate = new Date();
            currentDate.setTime(currentDate.getTime() + 1000 * 60 * 60 * 2);
            localStorage.setItem('fcw_session_end', currentDate.toString());
            /* Load saved session ELO */
            if (startingElo && !expired) {
              setStartingElo(Number(startingElo));
            } else {
              setStartingElo(player.elo);
            }
          } else {
            setStartingElo(player.elo);
          }
        }

        setElo(player.elo);
        setLevel(player.level);

        setWins(player.wins);
        setLosses(player.losses);

        setKills(player.avg.kills);
        setDeaths(player.avg.deaths);
        setKDRatio(player.avg.kd);
        setHSPercent(player.avg.hspercent);
        setWinsPercent(
          Math.round((player.avg.wins / player.avg.matches) * 100)
        );
        setAvgMatches(player.avg.matches);

        setRanking(player.ranking);
        setCurrentEloDistribution(
          getEloDistribution(player.level, player.ranking)
        );
      });
    };
    getStats(true);

    let refreshDelay = 30;
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      refreshDelay = parseInt(refreshParam);
    }

    if (refreshDelay < 10) {
      refreshDelay = 10;
    }

    const interval = setInterval(getStats, 1000 * refreshDelay);
    return () => {
      clearInterval(interval);
    };
  }, [avgMatchCount]);

  /* Custom CSS */
  useEffect(() => {
    if (style !== 'custom' || !customCSS) return;

    const head = document.head;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = customCSS;

    head.appendChild(link);
    return () => {
      head.removeChild(link);
    };
  }, [overrides, customCSS, style]);

  /** Returns player statistic */
  const getStat = useCallback(
    (stat: StatisticType) => {
      switch (stat) {
        case StatisticType.KILLS:
          return `${preview ? 20 : Math.round(kills / avgMatches)}`;
        case StatisticType.DEATHS:
          return `${preview ? 10 : Math.round(deaths / avgMatches)}`;
        case StatisticType.HSPERCENT:
          return `${preview ? '50' : Math.round(hsPercent / avgMatches)}%`;
        case StatisticType.KD:
          return `${preview ? '2' : Math.round((kdRatio / avgMatches) * 100) / 100}`;
        case StatisticType.WINRATIO:
          return `${preview ? '50' : winsPercent}%`;
        case StatisticType.RANKING:
          return `#${preview ? 999 : ranking}`;
        default:
          return `???`;
      }
    },
    [kills, deaths, winsPercent, hsPercent, ranking, avgMatches]
  );

  /** Returns player ELO text */
  const getElo = useCallback(() => {
    const currentElo = elo;
    let diff = 0;

    if (!preview) {
      diff = elo - startingElo;
    }

    let text = translate(`widget.elo${!showEloSuffix ? '_no_suffix' : ''}`, [
      String(currentElo),
    ]);
    if (showEloDiff) {
      text += translate(`widget.elo_diff`, [
        `${diff >= 0 ? `+${diff}` : String(diff)}`,
      ]);
    }
    return text;
  }, [language, elo, startingElo, showEloDiff, showEloSuffix]);

  return (
    <>
      {customColorScheme && (
        <style>{`
                .wrapper {
                    --text: ${customColor} !important;
                    --subtext: ${customColor} !important;
                    --border-1: ${customBorderColor} !important;
                    --border-2: ${customBorderColor2} !important;
                    --border-rotation: 0deg !important;
                    --background: ${customBackgroundColor} !important;
                }
            `}</style>
      )}
      {useBannerAsBackground && (
        <style>{`
                .wrapper {
                    --banner-url: url("${preview ? overrides?.playerBanner : banner}") !important;
                    ${backgroundOpacity ? `--banner-opacity: ${backgroundOpacity} !important;` : ''}
                }
            `}</style>
      )}
      {widgetOpacity !== 1 && (
        <style>{`.wrapper {
					--background-opacity: ${widgetOpacity} !important;
				}`}</style>
      )}
      <div
        className={`wrapper${compatibilityMode ? ' compatibility' : ''}`}
        style={
          {
            '--faceit-level': `var(--faceit-level-${currentEloDistribution[0]})`,
          } as CSSProperties
        }
      >
        <div className={`widget ${useBannerAsBackground ? 'banner' : ''}`}>
          <div className={'player-stats'}>
            <div className={'level'}>
              {getIcon()}

              <div className={'elo'}>
                {showUsername && (
                  <h2>{username || overrides?.username || '?'} </h2>
                )}
                <p className={showUsername ? '' : 'username-hidden'}>
                  {(rankingState === RankingState.SHOW ||
                    (rankingState === RankingState.ONLY_WHEN_CHALLENGER &&
                      ranking <= 1000)) && (
                      <span className={'ranking'}>#{ranking} </span>
                    )}
                  {getElo()}
                </p>
              </div>
            </div>
            <div className={'matches'}>
              <div className={'stats'}>
                <Statistic
                  color={'green'}
                  value={String(wins)}
                  text={translate('widget.wins')}
                />
                <Statistic
                  color={'red'}
                  value={String(losses)}
                  text={translate('widget.losses')}
                />
              </div>
            </div>
          </div>
          {showStatistics && (
            <div className={'average'}>
              {stats.map((stat) => {
                return (
                  <div className={'stat'}>
                    <p>{translate(`widget.${stat.toLowerCase()}`)}</p>
                    <p>{getStat(stat)}</p>
                  </div>
                );
              })}
            </div>
          )}
          {showEloProgressBar && (
            <div className={'progress-bar'}>
              <div
                className={'progress'}
                style={{
                  width:
                    level === 10
                      ? '100%'
                      : `${((elo - (currentEloDistribution[1][1] as number)) / ((currentEloDistribution[1][2] as number) - (currentEloDistribution[1][1] as number))) * 100}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
