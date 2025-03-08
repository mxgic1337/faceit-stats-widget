import { StatisticType } from '../generator/tabs/StatisticsTab.tsx';
import { Dispatch, useContext } from 'react';
import { LanguageContext } from '../generator/Generator.tsx';

export const Statistic = ({
  slot,
  statSlot,
  setStatSlot,
}: {
  slot: string;
  statSlot: StatisticType;
  setStatSlot: Dispatch<StatisticType>;
}) => {
  const tl = useContext(LanguageContext);
  if (!tl) {
    return null;
  }

  return (
    <>
      <div className={'setting'}>
        <p>{tl('generator.stats.slot', [slot])}</p>
        <select
          value={statSlot}
          onChange={(event) => {
            setStatSlot(event.target.value as StatisticType);
          }}
        >
          {Object.values(StatisticType).map((value) => {
            return (
              <option key={value} value={value}>
                {tl(`stat.${value.toLowerCase()}`)}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
