import {Language, tl} from "../../translations/translations.ts";
import {InfoBox} from "../../components/InfoBox.tsx";

export const AverageTab = ({language}: { language: Language }) => {
  return <>
    <div className={'setting'}>
      <InfoBox content={<p>{tl(language, 'generator.stats.disabled')}</p>} style={'warn'}/>
      <p>{tl(language, 'generator.stats.title')}</p>
    </div>
  </>
}