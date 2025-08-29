import { InfoBox } from '../../components/InfoBox.tsx';
import { useContext } from 'react';
import { Statistic } from '../../components/Statistic.tsx';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import { Checkbox } from '../../components/Checkbox.tsx';

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
        <div className={'setting'}>
          <Checkbox
            text={tl('generator.settings.only_official_matches')}
            setting={'onlyOfficialMatchesCount'}
          />
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
        <div className={'setting'}>
          <p>{tl('generator.settings.refresh_delay')}</p>
          <select
            value={settings.get('refreshInterval')}
            onChange={(event) => {
              settings.set(
                'refreshInterval',
                parseInt(event.currentTarget.value)
              );
            }}
          >
            <option value={10}>
              {tl('generator.settings.refresh_delay.quick', ['10'])}
            </option>
            <option value={30}>
              {tl('generator.settings.refresh_delay.normal', ['30'])}
            </option>
            <option value={60}>
              {tl('generator.settings.refresh_delay.slow', ['60'])}
            </option>
          </select>
        </div>
      </div>
    </>
  );
};
