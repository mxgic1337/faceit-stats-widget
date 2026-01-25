import { ReactElement, useCallback, useContext } from 'react';
import {
  LanguageContext,
  SettingsContext,
} from '../../../src/generator/Generator.tsx';
import { ShowRanking } from '../widget/Widget.tsx';
import { TimelineIcon } from '../../../src/assets/icons/tabler/TimelineIcon.tsx';

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

/** Shows player ELO, level, ranking, and username */
export const PlayerStats = ({
  preview,
  username,
  level,
  elo,
  startingElo,
  ranking,
}: {
  preview?: boolean;
  username?: string;
  level: number;
  elo: number;
  startingElo: number;
  ranking: number;
}) => {
  const SETTINGS = useContext(SettingsContext);
  const tl = useContext(LanguageContext);

  const getIcon = useCallback(() => {
    if (level === 10 && ranking <= 1000 && !preview) {
      if (ranking === 1) return levelIcons[11];
      else if (ranking === 2) return levelIcons[12];
      else if (ranking === 3) return levelIcons[13];
      return levelIcons[10]; /* Challenger */
    }
    return levelIcons[level - 1];
  }, [level, ranking, preview]);

  /** Returns player ELO text */
  const getEloDiff = useCallback(() => {
    if (!SETTINGS) return;

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
  }, [preview, elo, startingElo, SETTINGS]);

  if (!SETTINGS || !tl) {
    return null;
  }

  return (
    <div className={'level'}>
      {getIcon()}

      <div className={'elo'}>
        {SETTINGS.get('showUsername') && (
          <h2 className={elo === 0 ? 'skeleton' : ''}>
            {username || 'Player'}{' '}
          </h2>
        )}
        <p
          className={`${SETTINGS.get('showUsername') ? '' : 'username-hidden'} ${elo === 0 ? 'skeleton' : ''}`}
        >
          {(SETTINGS.get('showRanking') === ShowRanking.SHOW ||
            (SETTINGS.get('showRanking') === ShowRanking.ONLY_WHEN_CHALLENGER &&
              ranking <= 1000 &&
              !preview)) && (
            <span className={'ranking'}>#{ranking || 1337} </span>
          )}
          {SETTINGS.get('showIcons') && <TimelineIcon />}{' '}
          {tl(
            `widget.elo${!SETTINGS.get('showEloSuffix') ? '_no_suffix' : ''}`,
            [String(elo)]
          )}{' '}
          {SETTINGS.get('showEloDiff') && getEloDiff()}
        </p>
      </div>
    </div>
  );
};
