import { InfoBox } from '../../components/InfoBox.tsx';
import { Dispatch, useContext } from 'react';
import { Statistic } from '../../components/Statistic.tsx';
import { LanguageContext, SettingsContext } from '../Generator.tsx';

export enum StatisticType {
  KILLS = 'KILLS',
  DEATHS = 'DEATHS',
  WINRATIO = 'WINRATIO',
  HSPERCENT = 'HSPERCENT',
  KD = 'KD',
  RANKING = 'RANKING',
}

interface Props {
  setStatSlot1: Dispatch<StatisticType>;
  setStatSlot2: Dispatch<StatisticType>;
  setStatSlot3: Dispatch<StatisticType>;
  setStatSlot4: Dispatch<StatisticType>;
  setAverageStatsMatchCount: Dispatch<number>;
}

export const StatisticsTab = ({
  setStatSlot1,
  setStatSlot2,
  setStatSlot3,
  setStatSlot4,
  setAverageStatsMatchCount,
}: Props) => {
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);
  if (!settings || !tl) {
    return null;
  }
  return (
    <>
      <div className={'settings'}>
        {!settings.showStatistics && (
          <InfoBox
            content={<p>{tl('generator.stats.disabled')}</p>}
            style={'warn'}
          />
        )}
        <div className={'setting stats'}>
          <Statistic
            slot={'1'}
            statSlot={settings.statSlot1}
            setStatSlot={setStatSlot1}
          />
          <Statistic
            slot={'2'}
            statSlot={settings.statSlot2}
            setStatSlot={setStatSlot2}
          />
          <Statistic
            slot={'3'}
            statSlot={settings.statSlot3}
            setStatSlot={setStatSlot3}
          />
          <Statistic
            slot={'4'}
            statSlot={settings.statSlot4}
            setStatSlot={setStatSlot4}
          />
        </div>
      </div>
      <div className={'settings'}>
        <div className={'setting'}>
          <p>{tl('generator.stats.match_count')}</p>
          <select
            value={settings.averageStatsMatchCount}
            onChange={(e) => {
              setAverageStatsMatchCount(parseInt(e.currentTarget.value));
            }}
          >
            <option value="20">
              {tl('generator.stats.match_count.count', ['20'])}
            </option>
            <option value="30">
              {tl('generator.stats.match_count.count', ['30'])}
            </option>
          </select>
        </div>
      </div>
    </>
  );
};
