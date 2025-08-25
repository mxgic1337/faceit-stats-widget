import { StatisticType } from '../generator/tabs/StatisticsTab.tsx';
import { useContext } from 'react';
import { LanguageContext, SettingsContext } from '../generator/Generator.tsx';
import { SettingKey } from '../settings/manager.ts';

export const Statistic = ({
  slot,
  setting,
}: {
  slot: string;
  setting: SettingKey;
}) => {
  const settings = useContext(SettingsContext);
  const tl = useContext(LanguageContext);

  if (!tl || !settings) {
    return null;
  }

  return (
    <>
      <div className={'setting'}>
        <p>{tl('generator.stats.slot', [slot])}</p>
        <select
          value={settings.get(setting) as StatisticType}
          onChange={(event) => {
            settings.set(setting, event.target.value as StatisticType);
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
