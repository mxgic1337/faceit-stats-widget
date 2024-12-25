import {colorSchemes, themes} from "../../../widget/src/widget/Widget.tsx";
import {ColorPicker} from "../../components/generator/ColorPicker.tsx";
import {Language, tl} from "../../translations/translations.ts";
import {Dispatch, useRef} from "react";
import {Checkbox} from "../../components/generator/Checkbox.tsx";
import {InfoBox} from "../../components/generator/InfoBox.tsx";

type Props = {
  theme: string;
  language: Language;
  customBorderColor1: string;
  customBorderColor2: string;
  customTextColor: string;
  customBackgroundColor: string;
  customCSS: string;
  colorScheme: string;
  useBannerAsBackground: boolean;

  setTheme: Dispatch<string>;
  setCustomBorderColor1: Dispatch<string>;
  setCustomBorderColor2: Dispatch<string>;
  setCustomTextColor: Dispatch<string>;
  setCustomBackgroundColor: Dispatch<string>;
  setCustomCSS: Dispatch<string>;
  setColorScheme: Dispatch<string>;
  setUseBannerAsBackground: Dispatch<boolean>;
}

export const StyleTab = ({
                           theme, setTheme,
                           language,
                           colorScheme, setColorScheme,
                           customBorderColor1, setCustomBorderColor1,
                           customBorderColor2, setCustomBorderColor2,
                           customTextColor, setCustomTextColor,
                           customBackgroundColor, setCustomBackgroundColor,
                           useBannerAsBackground, setUseBannerAsBackground,
                           customCSS, setCustomCSS,
                         }: Props) => {
  const customCSSInputRef = useRef<HTMLInputElement>(null);

  return <>

    <div className={'setting'}>
      <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
        {colorSchemes.map(scheme => {
          return <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
        })}
      </select>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map(theme => {
          if (theme.hidden) return;
          return <option key={theme.id} value={theme.id}>{theme.name}</option>
        })}
      </select>

      {colorScheme === 'custom' && <>
        <ColorPicker text={tl(language, 'generator.theme.border_color_1')} color={customBorderColor1}
                     setColor={setCustomBorderColor1}/>
        <ColorPicker text={tl(language, 'generator.theme.border_color_2')} color={customBorderColor2}
                     setColor={setCustomBorderColor2}/>
        <ColorPicker text={tl(language, 'generator.theme.text_color')}
                     color={customTextColor} setColor={setCustomTextColor}/>
        <ColorPicker text={tl(language, 'generator.theme.background_color')}
                     color={customBackgroundColor} setColor={setCustomBackgroundColor}/>
      </>}

      {useBannerAsBackground &&
        <InfoBox style={'info'} content={<p>{tl(language, 'generator.theme.banner_as_background.warning')}</p>}/>}
      <Checkbox text={tl(language, 'generator.theme.banner_as_background')} state={useBannerAsBackground}
                setState={setUseBannerAsBackground}/>

      {theme === 'custom' && <>
        <p>{tl(language, 'generator.theme.custom_css.title')}</p>
        <input defaultValue={customCSS} ref={customCSSInputRef} onKeyDown={(e) => {
          if (e.code !== "Enter") return
          setCustomCSS(customCSSInputRef.current?.value as string)
        }}/>
        <small>{tl(language, 'generator.theme.custom_css.apply')}</small>
      </>}
    </div>
  </>
}