import { Styles } from '../components/Styles.tsx';
import { Statistics } from '../components/Statistics.tsx';
import { PlayerStats } from '../components/PlayerStats.tsx';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { WinLossStats } from '../components/WinLossStats.tsx';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  CSSProperties,
  useMemo,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Language,
  languages,
  tl,
} from '../../../src/translations/translations.ts';
import { getPlayerStats } from '../utils/faceit_util.ts';

import { StatisticType } from '../../../src/generator/tabs/StatisticsTab.tsx';

import '../styles/themes/normal.less';
import '../styles/themes/rounded.less';
import '../styles/themes/compact.less';
import '../styles/themes/rounded-compact.less';
import '../styles/themes/radar.less';
import '../styles/themes/classic.less';

import '../styles/color_schemes.less';
import {
  LanguageContext,
  SettingsContext,
} from '../../../src/generator/Generator.tsx';
import { useSettings } from '../../../src/settings/manager.ts';

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

export enum BackgroundType {
  NONE = 'none',
  AVATAR = 'avatar',
}

export const Widget = ({
  preview,
  previewBackground,
  previewUsername,
  previewElo,
  previewLevel,
  previewLanguage,
}: {
  preview: boolean;
  previewBackground?: string;
  previewUsername?: string;
  previewElo?: number;
  previewLevel?: number;
  previewLanguage?: Language;
}) => {
  const [username, setUsername] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  const [playerLevel, setPlayerLevel] = useState(previewLevel || 1);

  const [startingElo, setStartingElo] = useState<number>(0);
  const [playerElo, setPlayerElo] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ranking, setRanking] = useState(0);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [kdRatio, setKDRatio] = useState(0);
  const [hsPercent, setHSPercent] = useState(0);
  const [winsPercent, setWinsPercent] = useState(0);
  const [avgMatches, setAvgMatches] = useState(0);
  const [lastMatchId, setLastMatchId] = useState<string | undefined>();

  const level = useMemo(() => {
    return preview && previewLevel ? previewLevel : playerLevel;
  }, [playerLevel, preview, previewLevel]);

  const elo = useMemo(() => {
    return preview && previewElo ? previewElo : playerElo;
  }, [playerElo, preview, previewElo]);

  const { settings, getSetting, setSetting, loadSettingsFromQuery } =
    useSettings(true);
  const overrides = useContext(SettingsContext);

  /** Returns a color, min ELO and max ELO of a level */
  const currentEloDistribution = useMemo<[number, (string | number)[]]>(() => {
    if (preview) {
      return [level, eloDistribution[level - 1]];
    }
    if (level === 10 && ranking <= 1000) {
      if (ranking === 1) return [12, eloDistribution[11]];
      else if (ranking === 2) return [13, eloDistribution[12]];
      else if (ranking === 3) return [14, eloDistribution[13]];
      return [11, eloDistribution[10]]; /* Challenger */
    }
    return [level, eloDistribution[level - 1]];
  }, [preview, level]);

  const SETTINGS = useMemo(() => {
    return overrides || { settings, get: getSetting, set: setSetting };
  }, [overrides, settings, getSetting, setSetting]);

  const language = useMemo<Language>(() => {
    return (
      languages.find((lang) => lang.id === SETTINGS.get('widgetLanguage')) ||
      previewLanguage ||
      languages[0]
    );
  }, [SETTINGS, previewLanguage]);

  const translate = useCallback(
    (text: string, args?: string[]) => {
      return tl(language, text, args);
    },
    [language]
  );

  const [searchParams] = useSearchParams();

  const stats = useMemo(() => {
    if (!overrides || !preview) {
      const statsQ = searchParams.get('stats');
      if (statsQ) return statsQ.split(',') as StatisticType[];
      return [];
    }
    return [
      overrides.get('statSlot1'),
      overrides.get('statSlot2'),
      overrides.get('statSlot3'),
      overrides.get('statSlot4'),
    ];
  }, [preview, overrides, searchParams]);

  useEffect(() => {
    loadSettingsFromQuery();
  }, []);

  /** Returns a path to a level icon */
  const compatibilityMode = useMemo(() => {
    /* Check for older Chromium version */
    const userAgent = window.navigator.userAgent;
    const chromeVersion = userAgent
      .split(' ')
      .find((version) => version.startsWith('Chrome/'));
    return (
      chromeVersion && parseInt(chromeVersion.split('/')[1].split('.')[0]) < 120
    );
  }, []);

  /* Update player stats */
  useEffect(() => {
    if (preview) return;
    console.table(SETTINGS.settings);
    let startDate = new Date();
    const savedStartDate = localStorage.getItem('fcw_session_start');
    const savedPlayerId = localStorage.getItem('fcw_session_player-id');
    const saveSession = SETTINGS.get('saveSession');
    const playerId = SETTINGS.get('playerId');

    if (!playerId) {
      return;
    }

    let sessionExpired = false;
    if (saveSession) {
      const sessionEnd = localStorage.getItem('fcw_session_end');
      if (!sessionEnd) {
        sessionExpired = true;
      } else {
        const sessionEndDate = new Date(sessionEnd);
        if (new Date() > sessionEndDate) {
          sessionExpired = true;
        }
      }
      if (playerId !== savedPlayerId) {
        sessionExpired = true;
      }
      if (sessionExpired) {
        /* Save saved session data */
        console.log('Session expired. Saving new data...');
        localStorage.setItem('fcw_session_start', new Date().toString());
        localStorage.setItem('fcw_session_player-id', playerId);
        localStorage.removeItem('fcw_session_starting-elo');
      }
      if (!sessionExpired && savedStartDate && savedPlayerId === playerId) {
        console.log('Loaded starting date from session.');
        startDate = new Date(savedStartDate);
      }
    }

    let newStartingElo = 0;
    const getStats = (firstTime?: boolean, expired?: boolean) => {
      getPlayerStats(
        playerId,
        SETTINGS.get('averageStatsMatchCount'),
        startDate,
        SETTINGS.get('onlyOfficialMatchesCount')
      ).then((player) => {
        if (!player) return;
        setUsername(player.username);
        setAvatar(player.avatar);

        if (!player || !player.elo || !player.level) return;

        if (saveSession) {
          const currentDate = new Date();
          currentDate.setTime(currentDate.getTime() + 1000 * 60 * 60 * 2);
          localStorage.setItem('fcw_session_end', currentDate.toString());
        }

        const isStartingEloNotSet = firstTime || newStartingElo === 0;
        if (isStartingEloNotSet && saveSession) {
          /* Load saved session ELO */
          const startingElo = localStorage.getItem('fcw_session_starting-elo');
          if (startingElo && !expired) {
            newStartingElo = Number(startingElo);
            setStartingElo(newStartingElo);
            localStorage.setItem('fcw_session_starting-elo', startingElo);
          } else {
            newStartingElo = player.elo;
            setStartingElo(newStartingElo);
            localStorage.setItem(
              'fcw_session_starting-elo',
              String(player.elo)
            );
          }

          expired = false;
        } else if (isStartingEloNotSet) {
          setStartingElo(player.elo);
        }

        setPlayerElo(player.elo);
        setPlayerLevel(player.level);

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

        setLastMatchId(player.lastMatchId);
        if (firstTime || lastMatchId !== player.lastMatchId) {
          setRanking(player.ranking);
        }
      });
    };
    getStats(true, sessionExpired);

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
          if (!preview && (!kills || !avgMatches)) return null;
          return `${preview ? 20 : Math.round(kills / avgMatches)}`;
        case StatisticType.DEATHS:
          if (!preview && (!deaths || !avgMatches)) return null;
          return `${preview ? 10 : Math.round(deaths / avgMatches)}`;
        case StatisticType.HSPERCENT:
          if (!preview && (!hsPercent || !avgMatches)) return null;
          return `${preview ? '50' : Math.round(hsPercent / avgMatches)}%`;
        case StatisticType.KD:
          if (!preview && (!kdRatio || !avgMatches)) return null;
          return `${preview ? '2' : Math.round((kdRatio / avgMatches) * 100) / 100}`;
        case StatisticType.WINRATIO:
          if (!preview && !winsPercent) return null;
          return `${preview ? '50' : winsPercent}%`;
        case StatisticType.RANKING:
          if (!preview && !ranking) return null;
          return `#${preview ? 999 : ranking}`;
        default:
          return `???`;
      }
    },
    [
      preview,
      kills,
      deaths,
      winsPercent,
      hsPercent,
      ranking,
      avgMatches,
      kdRatio,
    ]
  );

  return (
    <SettingsContext.Provider value={SETTINGS}>
      <LanguageContext.Provider value={translate}>
        <Styles
          avatar={avatar}
          previewBackground={preview ? previewBackground : undefined}
        />
        <div
          className={`wrapper${compatibilityMode ? ' compatibility' : ''}${SETTINGS.get('showBorder') ? ' border' : ''}`}
          style={
            {
              '--faceit-level': `var(--faceit-level-${currentEloDistribution[0]})`,
            } as CSSProperties
          }
        >
          <div
            className={`widget ${SETTINGS.get('backgroundType') !== 'none' ? 'background-image' : ''}`}
          >
            <div className={'player-stats'}>
              <PlayerStats
                preview={preview}
                username={username || previewUsername}
                level={level}
                elo={elo}
                startingElo={startingElo}
                ranking={ranking}
              />
              <WinLossStats wins={wins} losses={losses} />
            </div>
            {SETTINGS.get('showStatistics') && (
              <Statistics stats={stats} getStat={getStat} />
            )}
            {SETTINGS.get('showEloProgressBar') && (
              <ProgressBar
                level={level}
                elo={elo}
                currentEloDistribution={currentEloDistribution}
              />
            )}
          </div>
        </div>
      </LanguageContext.Provider>
    </SettingsContext.Provider>
  );
};
