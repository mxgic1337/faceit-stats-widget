import { Statistic } from '../../../src/components/widget/Statistic.tsx';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Language,
  languages,
  tl,
} from '../../../src/translations/translations.ts';
import { getPlayerID, getPlayerStats } from '../utils/faceit_util.ts';

import fc1 from '../../../src/assets/levels/faceit1.svg';
import fc2 from '../../../src/assets/levels/faceit2.svg';
import fc3 from '../../../src/assets/levels/faceit3.svg';
import fc4 from '../../../src/assets/levels/faceit4.svg';
import fc5 from '../../../src/assets/levels/faceit5.svg';
import fc6 from '../../../src/assets/levels/faceit6.svg';
import fc7 from '../../../src/assets/levels/faceit7.svg';
import fc8 from '../../../src/assets/levels/faceit8.svg';
import fc9 from '../../../src/assets/levels/faceit9.svg';
import fc10 from '../../../src/assets/levels/faceit10.svg';
import fcChallenger from '../../../src/assets/levels/challenger.svg';
import fcChallenger1 from '../../../src/assets/levels/challenger_1.svg';
import fcChallenger2 from '../../../src/assets/levels/challenger_2.svg';
import fcChallenger3 from '../../../src/assets/levels/challenger_3.svg';

import sampleBanner from '../../../src/assets/sample_banner.png';
import { StatisticType } from '../../../src/generator/tabs/StatisticsTab.tsx';

import '../styles/themes/normal.less';
import '../styles/themes/compact.less';
import '../styles/themes/classic.less';

import '../styles/color_schemes.less';
import { SettingsContext } from '../../../src/generator/Generator.tsx';

export const themes: { id: string; hidden?: boolean }[] = [
  { id: 'normal' },
  { id: 'compact' },
  { id: 'classic' },
  { id: 'custom', hidden: true },
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
  fc1,
  fc2,
  fc3,
  fc4,
  fc5,
  fc6,
  fc7,
  fc8,
  fc9,
  fc10,
  fcChallenger,
  fcChallenger1,
  fcChallenger2,
  fcChallenger3 /* Challenger (Top 1000, Top 1, Top 2, Top 3) */,
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
  const [level, setLevel] = useState(1);
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [startingElo, setStartingElo] = useState<number>(100);
  const [elo, setElo] = useState(100);
  const [ranking, setRanking] = useState(999);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
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
    (string | number)[]
  >(eloDistribution[0]);
  const [rankingState, setRankingState] = useState<RankingState>(0);

  const [showEloDiff, setShowEloDiff] = useState<boolean>();
  const [showEloSuffix, setShowEloSuffix] = useState<boolean>();
  const [showStatistics, setShowStatistics] = useState<boolean>();
  const [showEloProgressBar, setShowEloProgressBar] = useState<boolean>();

  const [customColorScheme, setCustomColorScheme] = useState<boolean>();
  const [customColor, setCustomColor] = useState<string>();
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>();
  const [customBorderColor, setCustomBorderColor] = useState<string>();
  const [customBorderColor2, setCustomBorderColor2] = useState<string>();
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
    let themeParam = searchParams.get('theme');
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

    /* Redirect old theme format to new theme & style format */
    if (themeParam === 'dark' || themeParam === 'normal-custom') {
      themeParam = 'normal';
      colorSchemeParam = 'dark';
    } else if (
      (themeParam === 'compact' && !colorSchemeParam) ||
      themeParam === 'compact-custom'
    ) {
      themeParam = 'compact';
      if (themeParam === 'compact-custom') {
        colorSchemeParam = 'custom';
      } else {
        colorSchemeParam = 'dark';
      }
    } else if (themeParam === 'classic' && !colorSchemeParam) {
      colorSchemeParam = 'faceit';
    }

    if (statsParam) {
      setStats(statsParam.split(',') as StatisticType[]);
    }

    if (!onlyOfficialParam) {
      searchParams.set('only_official', 'true');
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

    let theme = themeParam;
    let scheme = colorSchemeParam;

    if (!themes.find((theme1) => theme1.id === theme)) {
      theme = 'normal';
    }
    if (!colorSchemes.find((scheme1) => scheme1 === scheme)) {
      scheme = 'dark';
    }

    document.getElementsByTagName('html')[0].classList.add(`${theme}-theme`);
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
        .classList.remove(`${theme}-theme`);
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
    setShowEloDiff(overrides.showEloDiff as boolean);
    setShowEloSuffix(overrides.showEloSuffix as boolean);
    setBackgroundOpacity(overrides.backgroundOpacity as number);
    setShowStatistics(overrides.showStatistics as boolean);
    setRankingState(
      overrides.showRanking ? RankingState.SHOW : RankingState.DISABLED
    );
    setUseBannerAsBackground(overrides.useBannerAsBackground as boolean);
    setLanguage(overrides.language);
    setCustomColorScheme(overrides.colorScheme === 'custom');
    setCustomColor(overrides.customTextColor);
    setCustomBackgroundColor(overrides.customBackgroundColor);
    setCustomBorderColor(overrides.customBorderColor1);
    setCustomBorderColor2(overrides.customBorderColor2);
    setShowEloProgressBar(overrides.showEloProgressBar);
  }, [overrides]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /** Returns a path to a level icon */
  const getIcon = useCallback(() => {
    if (preview) return levelIcons[10];
    if (level === 10 && ranking <= 1000) {
      if (ranking === 1) return levelIcons[11];
      else if (ranking === 2) return levelIcons[12];
      else if (ranking === 3) return levelIcons[13];
      return levelIcons[10]; /* Challenger */
    }
    return levelIcons[level - 1];
  }, [level, ranking, preview]);

  /** Returns a color, min ELO and max ELO of a level */
  const getEloDistribution = useCallback(
    (level: number, ranking: number) => {
      if (preview) return eloDistribution[10];
      if (level === 10 && ranking <= 1000) {
        if (ranking === 1) return eloDistribution[11];
        else if (ranking === 2) return eloDistribution[12];
        else if (ranking === 3) return eloDistribution[13];
        return eloDistribution[10]; /* Challenger */
      }
      return eloDistribution[level - 1];
    },
    [preview]
  );

  /* Update player stats */
  useEffect(() => {
    if (preview) {
      setCurrentEloDistribution(eloDistribution[10]);
      return;
    }

    const startDate = new Date();

    const playerId = searchParams.get('player_id');
    const samplePlayerId = '24180323-d946-4bb7-a334-be3e96fcac05';
    if (playerId === null) {
      const username = searchParams.get('player');
      if (username !== null) {
        getPlayerID(username).then((id) => {
          window.open(`${window.location}&player_id=${id}`, '_self');
        });
        return;
      }
      navigate(`?player_id=${samplePlayerId}`);
      return;
    }

    const getStats = (firstTime?: boolean) => {
      getPlayerStats(
        playerId,
        startDate,
        searchParams.get('only_official') === 'true'
      ).then((player) => {
        if (!player) return;
        setUsername(player.username);
        setBanner(player.banner);

        if (!player || !player.elo || !player.level) return;
        if (firstTime) setStartingElo(player.elo);

        setElo(player.elo);
        setLevel(player.level);

        setWins(player.wins);
        setLosses(player.losses);

        setKills(player.avg.kills);
        setDeaths(player.avg.deaths);
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
  }, []);

  /* Custom CSS */
  useEffect(() => {
    if (searchParams.get('theme') !== 'custom') return;

    const cssPath =
      overrides?.customCSS || searchParams.get('css') || undefined;
    if (!cssPath) return;

    const head = document.head;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = cssPath;

    head.appendChild(link);
    return () => {
      head.removeChild(link);
    };
  }, [overrides]);

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
          return `${preview ? '2' : Math.round((kills / deaths) * 100) / 100}`;
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
    const currentElo = preview ? 2001 : elo;
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
                    --background-url: url("${preview ? sampleBanner : banner}") !important;
                    ${backgroundOpacity ? `--background-opacity: ${backgroundOpacity} !important;` : ''}
                }
            `}</style>
      )}
      <div className={'wrapper'}>
        <div className={`widget ${useBannerAsBackground ? 'banner' : ''}`}>
          <div className={'player-stats'}>
            <div className={'level'}>
              <img src={getIcon()} alt={`Level ${preview ? 10 : level}`} />
              <div className={'elo'}>
                {showUsername && (
                  <h2>{username || overrides?.username || '?'}</h2>
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
                    preview || level === 10
                      ? '100%'
                      : `${((elo - (currentEloDistribution[1] as number)) / ((currentEloDistribution[2] as number) - (currentEloDistribution[1] as number))) * 100}%`,
                  background: currentEloDistribution[0],
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
