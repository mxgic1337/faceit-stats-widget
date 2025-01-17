import { Language, tl } from '../translations/translations.ts';
import { StatisticType } from '../generator/tabs/StatisticsTab.tsx';
import { Dispatch } from 'react';

export const Statistic = ({
  language,
  slot,
  statSlot,
  setStatSlot,
}: {
  language: Language;
  slot: string;
  statSlot: StatisticType;
  setStatSlot: Dispatch<StatisticType>;
}) => {
  return (
    <div className={'setting'}>
      <p>{tl(language, 'generator.stats.slot', [slot])}</p>
      <select
        value={statSlot}
        onChange={(event) => {
          console.log(`${event.target.value}`);
          setStatSlot(event.target.value as StatisticType);
        }}
      >
        {Object.values(StatisticType).map((value) => {
          return (
            <option key={value} value={value}>
              {tl(language, `stat.${value.toLowerCase()}`)}
            </option>
          );
        })}
      </select>
    </div>
  );
};
