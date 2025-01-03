import {InfoBox} from "../../components/generator/InfoBox.tsx";
import {Dispatch, useContext} from "react";
import {Statistic} from "../../components/generator/Statistic.tsx";
import {Separator} from "../../components/generator/Separator.tsx";
import {LanguageContext, SettingsContext} from "../Generator.tsx";

export enum StatisticType {
  KILLS = "KILLS",
  DEATHS = "DEATHS",
  WINRATIO = "WINRATIO",
  HSPERCENT = "HSPERCENT",
  KD = "KD",
  RANKING = "RANKING",
}

interface Props {
  setStatSlot1: Dispatch<StatisticType>;
  setStatSlot2: Dispatch<StatisticType>;
  setStatSlot3: Dispatch<StatisticType>;
  setStatSlot4: Dispatch<StatisticType>;
}

export const StatisticsTab = ({
                                setStatSlot1,
                                setStatSlot2,
                                setStatSlot3,
                                setStatSlot4
                              }: Props) => {
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);
  if (!settings || !tl) {
    return null;
  }
  return <>
    <Separator text={tl('generator.stats.title')}/>
    <div className={'setting stats'}>
      {!settings.showStatistics &&
        <InfoBox content={<p>{tl('generator.stats.disabled')}</p>} style={'warn'}/>}
      <Statistic slot={"1"} language={settings.language} statSlot={settings.statSlot1} setStatSlot={setStatSlot1}/>
      <Statistic slot={"2"} language={settings.language} statSlot={settings.statSlot2} setStatSlot={setStatSlot2}/>
      <Statistic slot={"3"} language={settings.language} statSlot={settings.statSlot3} setStatSlot={setStatSlot3}/>
      <Statistic slot={"4"} language={settings.language} statSlot={settings.statSlot4} setStatSlot={setStatSlot4}/>
    </div>
  </>
}