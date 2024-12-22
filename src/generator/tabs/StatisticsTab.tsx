import {Language, tl} from "../../translations/translations.ts";
import {InfoBox} from "../../components/generator/InfoBox.tsx";
import {Dispatch} from "react";
import {Statistic} from "../../components/generator/Statistic.tsx";

export enum StatisticType {
  KILLS = "KILLS",
  DEATHS = "DEATHS",
  WINRATIO = "WINRATIO",
  HSPERCENT = "HSPERCENT",
  KD = "KD",
  RANKING = "RANKING",
}

interface Props {
  language: Language;
  showStatistics: boolean;
  statSlot1: StatisticType;
  statSlot2: StatisticType;
  statSlot3: StatisticType;
  statSlot4: StatisticType;
  setStatSlot1: Dispatch<StatisticType>;
  setStatSlot2: Dispatch<StatisticType>;
  setStatSlot3: Dispatch<StatisticType>;
  setStatSlot4: Dispatch<StatisticType>;
}

export const StatisticsTab = ({
                                language,
                                showStatistics,
                                statSlot1,
                                statSlot2,
                                statSlot3,
                                statSlot4,
                                setStatSlot1,
                                setStatSlot2,
                                setStatSlot3,
                                setStatSlot4
                              }: Props) => {
  return <>
    <div className={'setting'}>
      {!showStatistics && <InfoBox content={<p>{tl(language, 'generator.stats.disabled')}</p>} style={'warn'}/>}
      <Statistic slot={"1"} language={language} statSlot={statSlot1} setStatSlot={setStatSlot1}/>
      <Statistic slot={"2"} language={language} statSlot={statSlot2} setStatSlot={setStatSlot2}/>
      <Statistic slot={"3"} language={language} statSlot={statSlot3} setStatSlot={setStatSlot3}/>
      <Statistic slot={"4"} language={language} statSlot={statSlot4} setStatSlot={setStatSlot4}/>
    </div>
  </>
}