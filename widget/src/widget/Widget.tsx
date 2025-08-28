import { Statistic } from '../components/Statistic.tsx';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  CSSProperties,
  useMemo,
  useLayoutEffect,
  ReactElement,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Language,
  languages,
  tl,
} from '../../../src/translations/translations.ts';
import { getPlayerStats } from '../utils/faceit_util.ts';
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
import '../styles/themes/rounded.less';
import '../styles/themes/compact.less';
import '../styles/themes/rounded-compact.less';
import '../styles/themes/classic.less';

import '../styles/color_schemes.less';
import { SettingsContext } from '../../../src/generator/Generator.tsx';
import { useSettings } from '../../../src/settings/manager.ts';
import { TimelineIcon } from '../../../src/assets/icons/tabler/TimelineIcon.tsx';
import { ArrowUpIcon } from '../../../src/assets/icons/tabler/ArrowUpIcon.tsx';
import { ArrowDownIcon } from '../../../src/assets/icons/tabler/ArrowDownIcon.tsx';

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

export enum ShowRanking {
  DISABLED = 0,
  SHOW = 1,
  ONLY_WHEN_CHALLENGER = 2,
}

export const Widget = ({
  preview,
  previewBanner,
  previewUsername,
  previewElo,
  previewLevel,
  previewLanguage,
}: {
  preview: boolean;
  previewBanner?: string;
  previewUsername?: string;
  previewElo?: number;
  previewLevel?: number;
  previewLanguage?: Language;
}) => {
  const [username, setUsername] = useState<string>();
  const [banner, setBanner] = useState<string>();

  const [level, setLevel] = useState(1);
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [startingElo, setStartingElo] = useState<number>(100);
  const [elo, setElo] = useState(100);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ranking, setRanking] = useState(1337);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [kdRatio, setKDRatio] = useState(0);
  const [hsPercent, setHSPercent] = useState(0);
  const [winsPercent, setWinsPercent] = useState(0);
  const [avgMatches, setAvgMatches] = useState(0);
  const [currentEloDistribution, setCurrentEloDistribution] = useState<
    [number, (string | number)[]]
  >([1, eloDistribution[0]]);
  const [compatibilityMode, setCompatibilityMode] = useState<boolean>(false);
  const [stats, setStats] = useState<StatisticType[]>([
    StatisticType.KILLS,
    StatisticType.KD,
    StatisticType.WINRATIO,
    StatisticType.HSPERCENT,
  ]);

  const { settings, getSetting, setSetting, loadSettingsFromQuery } =
    useSettings(true);
  const overrides = useContext(SettingsContext);

  const SETTINGS = useMemo(() => {
    return overrides || { settings, get: getSetting, set: setSetting };
  }, [overrides, settings]);

  const translate = useCallback(
    (text: string, args?: string[]) => {
      return tl(language, text, args);
    },
    [language]
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!previewElo || !previewLevel) return;
    setElo(previewElo);
    setLevel(previewLevel);
    setCurrentEloDistribution(getEloDistribution(previewLevel, 1337));
  }, [previewElo, previewLevel]);

  useEffect(() => {
    if (!overrides || !preview) return;
    setStats([
      overrides.get('statSlot1'),
      overrides.get('statSlot2'),
      overrides.get('statSlot3'),
      overrides.get('statSlot4'),
    ]);
  }, [preview, overrides]);

  /* Load settings */
  useLayoutEffect(() => {
    if (preview) return;
    loadSettingsFromQuery();
    const statsQ = searchParams.get('stats');
    if (statsQ) setStats(statsQ.split(',') as StatisticType[]);
  }, [searchParams]);

  useLayoutEffect(() => {
    setLanguage(
      languages.find((lang) => lang.id === SETTINGS.get('widgetLanguage')) ||
        previewLanguage ||
        languages[0]
    );
  }, [SETTINGS]);

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
    if (preview) return;
    console.log(
      `%cWidget settings:%c\n%o`,
      'font-weight: bold;',
      '',
      SETTINGS.settings
    );
    let startDate = new Date();
    const savedStartDate = localStorage.getItem('fcw_session_start');
    const savedPlayerId = localStorage.getItem('fcw_session_player-id');
    const saveSession = SETTINGS.get('saveSession');
    const playerId = SETTINGS.get('playerId');
    if (saveSession && savedStartDate && savedPlayerId === playerId) {
      console.log('Loaded starting date from session.');
      startDate = new Date(savedStartDate);
    }
    if (!playerId) {
      return;
    }
    const getStats = (firstTime?: boolean) => {
      getPlayerStats(
        playerId,
        SETTINGS.get('averageStatsMatchCount'),
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

    /* Check for older Chromium version */
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

    let refreshDelay = 30;
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      refreshDelay = parseInt(refreshParam);
    }

    if (refreshDelay < 10) {
      refreshDelay = 10;
    }

    /* Set widget style and color scheme */
    document
      .getElementsByTagName('html')[0]
      .classList.add(`${SETTINGS.get('style')}-theme`);
    document
      .getElementsByTagName('html')[0]
      .classList.add(`${SETTINGS.get('colorScheme')}-scheme`);
    if (SETTINGS.get('autoWidth'))
      document.getElementsByTagName('html')[0].classList.add(`auto-width`);

    const interval = setInterval(
      getStats,
      1000 * SETTINGS.get('refreshInterval') || 30000
    );
    return () => {
      clearInterval(interval);
      document
        .getElementsByTagName('html')[0]
        .classList.remove(`${SETTINGS.get('style')}-theme`);
      document
        .getElementsByTagName('html')[0]
        .classList.remove(`${SETTINGS.get('colorScheme')}-scheme`);
      if (SETTINGS.get('autoWidth'))
        document.getElementsByTagName('html')[0].classList.remove(`auto-width`);
    };
  }, [SETTINGS]);

  /* Custom CSS */
  useEffect(() => {
    const customCSS = SETTINGS.get('customCSS');
    if (SETTINGS.get('style') !== 'custom' || !customCSS) return;

    const head = document.head;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = customCSS;

    head.appendChild(link);
    return () => {
      head.removeChild(link);
    };
  }, [SETTINGS]);

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
  const getEloDiff = useCallback(() => {
    let diff = 0;

    if (!preview) {
      diff = elo - startingElo;
    }

    let diffArrow: ReactElement | null = null;
    let diffStyle: string = '';

    if (diff > 0) {
      diffArrow = <ArrowUpIcon />;
      diffStyle = 'gain';
    } else if (diff < 0) {
      diffArrow = <ArrowDownIcon />;
      diffStyle = 'loss';
    }

    return (
      <span className={`diff ${diffStyle}`}>
        ({SETTINGS.get('showIcons') ? diffArrow : null}
        {diff >= 0 ? `+${diff}` : String(diff)})
      </span>
    );
  }, [language, elo, startingElo, SETTINGS]);

  return (
    <>
      {SETTINGS.get('colorScheme') === 'custom' && (
        <style>{`
                .wrapper {
                    --text: #${SETTINGS.get('customTextColor')} !important;
                    --subtext: #${SETTINGS.get('customTextColor')} !important;
                    --border-1: #${SETTINGS.get('customBorderColor1')} !important;
                    --border-2: #${SETTINGS.get('customBorderColor2')} !important;
                    --border-rotation: 0deg !important;
                    --background: #${SETTINGS.get('customBackgroundColor')} !important;
                }
            `}</style>
      )}
      {SETTINGS.get('useBannerAsBackground') && (
        <style>{`
                .wrapper {
                    --banner-url: url("${preview ? previewBanner : banner}") !important;
                    ${SETTINGS.get('adjustBackgroundOpacity') ? `--banner-opacity: ${SETTINGS.get('backgroundOpacity')} !important;` : ''}
                }
            `}</style>
      )}
      {SETTINGS.get('widgetOpacity') !== 1 && (
        <style>{`.wrapper {
					--background-opacity: ${SETTINGS.get('widgetOpacity')} !important;
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
        <div
          className={`widget ${SETTINGS.get('useBannerAsBackground') ? 'banner' : ''}`}
        >
          <div className={'player-stats'}>
            <div className={'level'}>
              {getIcon()}

              <div className={'elo'}>
                {SETTINGS.get('showUsername') && (
                  <h2>{username || previewUsername || '?'} </h2>
                )}
                <p
                  className={
                    SETTINGS.get('showUsername') ? '' : 'username-hidden'
                  }
                >
                  {(SETTINGS.get('showRanking') === ShowRanking.SHOW ||
                    (SETTINGS.get('showRanking') ===
                      ShowRanking.ONLY_WHEN_CHALLENGER &&
                      ranking <= 1000)) && (
                    <span className={'ranking'}>#{ranking} </span>
                  )}
                  {SETTINGS.get('showIcons') && <TimelineIcon />}{' '}
                  {translate(
                    `widget.elo${!SETTINGS.get('showEloSuffix') ? '_no_suffix' : ''}`,
                    [String(elo)]
                  )}{' '}
                  {SETTINGS.get('showEloDiff') && getEloDiff()}
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
          {SETTINGS.get('showStatistics') && (
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
          {SETTINGS.get('showEloProgressBar') && (
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
