import {colorSchemes, themes} from "../../../widget/src/widget/Widget.tsx";
import {ColorPicker} from "../../components/generator/ColorPicker.tsx";
import {Dispatch, useContext, useRef} from "react";
import {Checkbox} from "../../components/generator/Checkbox.tsx";
import {InfoBox} from "../../components/generator/InfoBox.tsx";
import {Separator} from "../../components/generator/Separator.tsx";
import {LanguageContext, SettingsContext} from "../Generator.tsx";

type Props = {
  setTheme: Dispatch<string>;
  setCustomBorderColor1: Dispatch<string>;
  setCustomBorderColor2: Dispatch<string>;
  setCustomTextColor: Dispatch<string>;
  setCustomBackgroundColor: Dispatch<string>;
  setCustomCSS: Dispatch<string>;
  setColorScheme: Dispatch<string>;
  setUseBannerAsBackground: Dispatch<boolean>;
  setAdjustBackgroundOpacity: Dispatch<boolean>;
  setBackgroundOpacity: Dispatch<number>;
}

export const StyleTab = ({
                           setTheme,
                           setColorScheme,
                           setCustomBorderColor1,
                           setCustomBorderColor2,
                           setCustomTextColor,
                           setCustomBackgroundColor,
                           setUseBannerAsBackground,
                           setAdjustBackgroundOpacity,
                           setBackgroundOpacity,
                           setCustomCSS,
                         }: Props) => {
  const customCSSInputRef = useRef<HTMLInputElement>(null);
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);
  if (!settings || !tl) {
    return null;
  }

  return <>
    <Separator text={tl('generator.theme.title')}/>
    <div className={'setting'}>
      <div className={'flex'}>
        <div>
          <p>{tl('generator.theme.color_scheme')}</p>
          <select value={settings.colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
            {colorSchemes.map(scheme => {
              return <option key={scheme} value={scheme}>{tl(`scheme.${scheme}`)}</option>
            })}
          </select>
        </div>
        <div>
          <p>{tl('generator.theme.style')}</p>
          <select value={settings.theme} onChange={(e) => setTheme(e.target.value)}>
            {themes.map(theme => {
              if (theme.hidden) return;
              return <option key={theme.id} value={theme.id}>{tl(`theme.${theme.id}`)}</option>
            })}
          </select>
        </div>
      </div>
      <Checkbox text={tl('generator.theme.banner_as_background')}
                state={settings.useBannerAsBackground}
                setState={setUseBannerAsBackground}/>
      {settings.useBannerAsBackground &&
        <>
          <Checkbox text={tl('generator.theme.banner_as_background.adjust_opacity')}
                    state={settings.adjustBackgroundOpacity}
                    setState={setAdjustBackgroundOpacity}/>
          <div className={'flex'} style={{alignItems: 'center'}}>
            <input type={'range'} value={settings.backgroundOpacity} min={0.01} max={1} step={0.01}
                   disabled={!settings.adjustBackgroundOpacity} onChange={(event) => {
              setBackgroundOpacity(parseFloat(event.currentTarget.value))
            }}/>
            <p style={{width: '50px', textAlign: 'right'}}>{Math.round(settings.backgroundOpacity * 100)}%</p>
          </div>
          <InfoBox style={'info'}
                   content={<p>{tl('generator.theme.banner_as_background.warning')}</p>}/>
        </>}
    </div>

    {settings.colorScheme === 'custom' && <div className={'setting'}>
      <ColorPicker text={tl('generator.theme.border_color_1')} color={settings.customBorderColor1}
                   setColor={setCustomBorderColor1}/>
      <ColorPicker text={tl('generator.theme.border_color_2')} color={settings.customBorderColor2}
                   setColor={setCustomBorderColor2}/>
      <ColorPicker text={tl('generator.theme.text_color')}
                   color={settings.customTextColor} setColor={setCustomTextColor}/>
      <ColorPicker text={tl('generator.theme.background_color')}
                   color={settings.customBackgroundColor} setColor={setCustomBackgroundColor}/>
    </div>}

    {settings.theme === 'custom' && <div className={'setting'}>
      <p>{tl('generator.theme.custom_css.title')}</p>
      <input defaultValue={settings.customCSS} ref={customCSSInputRef} onKeyDown={(e) => {
        if (e.code !== "Enter") return
        setCustomCSS(customCSSInputRef.current?.value as string)
      }}/>
      <small>{tl('generator.theme.custom_css.apply')}</small>
    </div>}
  </>
}