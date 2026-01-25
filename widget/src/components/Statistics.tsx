import { useContext } from 'react';
import { LanguageContext } from '../../../src/generator/Generator.tsx';
import { StatisticType } from '../../../src/generator/tabs/StatisticsTab.tsx';

/** Shows player's average statistics from last 20/30 matches */
export const Statistics = ({
  stats,
  getStat,
}: {
  stats: StatisticType[];
  getStat: (stat: StatisticType) => string | null;
}) => {
  const tl = useContext(LanguageContext);

  if (!tl) {
    return null;
  }

  return (
    <div className={'average'}>
      {stats.map((stat) => {
        return (
          <div className={'stat'} key={stat}>
            <p>{tl(`widget.${stat.toLowerCase()}`)}</p>
            <p>{getStat(stat) || <span className={'skeleton'}>???</span>}</p>
          </div>
        );
      })}
    </div>
  );
};
