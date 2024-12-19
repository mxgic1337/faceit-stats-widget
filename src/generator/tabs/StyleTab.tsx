import {colorSchemes, themes} from "../../widget/Widget.tsx";
import {ColorPicker} from "../../components/ColorPicker.tsx";
import {Language, tl} from "../../translations/translations.ts";
import {Dispatch, useRef} from "react";

type Props = {
  theme: string;
  language: Language;
  customBorderColor1: string;
  customBorderColor2: string;
  customTextColor: string;
  customBackgroundColor: string;
  customCSS: string;
  colorScheme: string;

  setTheme: Dispatch<string>;
  setCustomBorderColor1: Dispatch<string>;
  setCustomBorderColor2: Dispatch<string>;
  setCustomTextColor: Dispatch<string>;
  setCustomBackgroundColor: Dispatch<string>;
  setCustomCSS: Dispatch<string>;
  setColorScheme: Dispatch<string>;
}

export const StyleTab = ({
                           theme, setTheme,
                           language,
                           colorScheme, setColorScheme,
                           customBorderColor1, setCustomBorderColor1,
                           customBorderColor2, setCustomBorderColor2,
                           customTextColor, setCustomTextColor,
                           customBackgroundColor, setCustomBackgroundColor,
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
        <ColorPicker text={tl(language, 'generator.theme.border-color-1')} color={customBorderColor1}
                     setColor={setCustomBorderColor1}/>
        <ColorPicker text={tl(language, 'generator.theme.border-color-2')} color={customBorderColor2}
                     setColor={setCustomBorderColor2}/>
        <ColorPicker text={tl(language, 'generator.theme.text-color')}
                     color={customTextColor} setColor={setCustomTextColor}/>
        <ColorPicker text={tl(language, 'generator.theme.background-color')}
                     color={customBackgroundColor} setColor={setCustomBackgroundColor}/>
      </>}

      {theme === 'custom' && <>
        <p>{tl(language, 'generator.theme.custom-css.title')}</p>
        <input defaultValue={customCSS} ref={customCSSInputRef} onKeyDown={(e) => {
          if (e.code !== "Enter") return
          setCustomCSS(customCSSInputRef.current?.value as string)
        }}/>
        <small>{tl(language, 'generator.theme.custom-css.apply')}</small>
      </>}
    </div>
  </>
}