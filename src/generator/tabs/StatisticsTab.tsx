import { InfoBox } from '../../components/InfoBox.tsx';
import { useContext } from 'react';
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

export const StatisticsTab = () => {
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);
  if (!settings || !tl) {
    return null;
  }
  return (
    <>
      <div className={'settings'}>
        {!settings.get('showStatistics') && (
          <InfoBox
            content={<p>{tl('generator.stats.disabled')}</p>}
            style={'warn'}
          />
        )}
        <div className={'setting stats'}>
          <Statistic slot={'1'} setting={'statSlot1'} />
          <Statistic slot={'2'} setting={'statSlot2'} />
          <Statistic slot={'3'} setting={'statSlot3'} />
          <Statistic slot={'4'} setting={'statSlot4'} />
        </div>
      </div>
      <div className={'settings'}>
        <div className={'setting'}>
          <p>{tl('generator.stats.match_count')}</p>
          <select
            value={settings.get('averageStatsMatchCount')}
            onChange={(e) => {
              settings.set(
                'averageStatsMatchCount',
                parseInt(e.currentTarget.value)
              );
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
