import { colorSchemes, styles } from '../../../widget/src/styles/styles';
import { ColorPicker } from '../../components/ColorPicker.tsx';
import { useContext, useRef } from 'react';
import { Checkbox } from '../../components/Checkbox.tsx';
import { InfoBox } from '../../components/InfoBox.tsx';
import { LanguageContext, SettingsContext } from '../Generator.tsx';
import helpTextColor from '../../assets/help/text_color.png';
import helpSubtextColor from '../../assets/help/subtext_color.png';
import helpTextShadowColor from '../../assets/help/text_shadow_color.png';
import helpBackgroundColor from '../../assets/help/background_color.png';
import helpBorder1 from '../../assets/help/border_1.png';
import helpBorder2 from '../../assets/help/border_2.png';
import helpWins from '../../assets/help/wins.png';
import helpLosses from '../../assets/help/losses.png';
import helpWinsText from '../../assets/help/wins_text.png';
import helpLossesText from '../../assets/help/losses_text.png';
import { BackgroundType } from '../../../widget/src/widget/Widget.tsx';

export const StyleTab = ({
  username,
  playerAvatar,
}: {
  username: string;
  playerAvatar?: string;
}) => {
  const customCSSInputRef = useRef<HTMLInputElement>(null);
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);
  if (!settings || !tl) {
    return null;
  }

  return (
    <>
      <div className={'settings'}>
        <div className={'setting'}>
          <div className={'flex'}>
            <div>
              <p>{tl('generator.theme.color_scheme')}</p>
              <select
                value={settings.get('colorScheme') as string}
                onChange={(e) => settings.set('colorScheme', e.target.value)}
              >
                {colorSchemes.map((scheme) => {
                  return (
                    <option key={scheme} value={scheme}>
                      {tl(`scheme.${scheme}`)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <p>{tl('generator.theme.style')}</p>
              <select
                value={settings.get('style') as string}
                onChange={(e) => settings.set('style', e.target.value)}
              >
                {styles.map((style) => {
                  if (style.hidden) return;
                  return (
                    <option key={style.id} value={style.id}>
                      {tl(`style.${style.id}`)}{' '}
                      {style.experimental
                        ? `(${tl('generator.experimental')})`
                        : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <Checkbox
            text={tl('generator.theme.show_border')}
            setting={'showBorder'}
          />
        </div>

        {/* Custom CSS */}

        {settings.get('style') === 'custom' && (
          <div className={'setting'}>
            <p>
              {tl('generator.theme.custom_css.title')}{' '}
              <span
                className={'badge'}
                title={tl('generator.experimental.help')}
              >
                {tl('generator.experimental')}
              </span>
            </p>
            <input
              defaultValue={settings.get('customCSS')}
              ref={customCSSInputRef}
              onKeyDown={(e) => {
                if (e.code !== 'Enter') return;
                settings.set(
                  'customCSS',
                  customCSSInputRef.current?.value as string
                );
              }}
            />
            <small>{tl('generator.theme.custom_css.apply')}</small>
          </div>
        )}
      </div>

      <div className={'settings'}>
        <InfoBox
          content={tl('generator.deprecated.widget_only', [
            tl('generator.theme.banner_as_background'),
            '4.0.0',
          ])}
          style={'warn'}
        />
        {/* Banner background settings */}

        <p>{tl('generator.theme.background.type')}</p>
        <select
          onChange={(e) => {
            settings.set('backgroundType', e.currentTarget.value);
          }}
          value={settings.get('backgroundType')}
        >
          {Object.values(BackgroundType).map((types) => {
            return (
              <option value={types}>
                {tl(`generator.theme.background.type.${types}`)}
              </option>
            );
          })}
        </select>

        {settings.get('backgroundType') !== BackgroundType.NONE && (
          <>
            <Checkbox
              text={tl('generator.theme.background.adjust_opacity')}
              setting={'adjustBackgroundOpacity'}
            />
            {settings.get('adjustBackgroundOpacity') && (
              <div className={'flex'} style={{ alignItems: 'center' }}>
                <input
                  type={'range'}
                  value={settings.get('backgroundOpacity')}
                  min={0.01}
                  max={1}
                  step={0.01}
                  disabled={!settings.get('adjustBackgroundOpacity')}
                  onChange={(event) => {
                    settings.set(
                      'backgroundOpacity',
                      parseFloat(event.currentTarget.value)
                    );
                  }}
                />
                <p style={{ width: '50px', textAlign: 'right' }}>
                  {Math.round(settings.get('backgroundOpacity') * 100)}%
                </p>
              </div>
            )}
            {settings.get('adjustBackgroundOpacity') &&
              settings.get('backgroundOpacity') > 0.5 && (
                <InfoBox
                  style={'warn'}
                  content={
                    <p>
                      {tl('generator.theme.background.readability_warning')}
                    </p>
                  }
                />
              )}
            {!playerAvatar && (
              <InfoBox
                style={'info'}
                content={
                  <p>
                    {tl('generator.theme.background.no_avatar', [username])}
                  </p>
                }
              />
            )}
            <p>{tl('generator.theme.background.blur')}</p>
            <div className={'flex'} style={{ alignItems: 'center' }}>
              <input
                type={'range'}
                value={settings.get('blurLength')}
                min={0}
                max={10}
                step={1}
                disabled={
                  settings.get('backgroundType') === BackgroundType.NONE
                }
                onChange={(event) => {
                  settings.set(
                    'blurLength',
                    parseInt(event.currentTarget.value)
                  );
                }}
              />
              <p style={{ width: '22px', textAlign: 'right' }}>
                {settings.get('blurLength')}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Custom color scheme settings */}

      {settings.get('colorScheme') === 'custom' && (
        <div className={'settings'}>
          <div className={'setting'}>
            <ColorPicker
              text={tl('generator.theme.text_color')}
              setting={'customTextColor'}
              helpImage={helpTextColor}
            />
            <ColorPicker
              text={tl('generator.theme.subtext_color')}
              setting={'customSubtextColor'}
              helpImage={helpSubtextColor}
            />
            <ColorPicker
              text={tl('generator.theme.text_shadow_color')}
              setting={'customTextShadowColor'}
              helpImage={helpTextShadowColor}
            />
            <ColorPicker
              text={tl('generator.theme.background_color')}
              setting={'customBackgroundColor'}
              helpImage={helpBackgroundColor}
            />
            <ColorPicker
              text={tl('generator.theme.border_color_1')}
              setting={'customBorderColor1'}
              helpImage={helpBorder1}
            />
            <ColorPicker
              text={tl('generator.theme.border_color_2')}
              setting={'customBorderColor2'}
              helpImage={helpBorder2}
            />
            <ColorPicker
              text={tl('generator.theme.wins_color')}
              setting={'customWinsColor'}
              helpImage={helpWins}
            />
            <ColorPicker
              text={tl('generator.theme.losses_color')}
              setting={'customLossesColor'}
              helpImage={helpLosses}
            />
            <ColorPicker
              text={tl('generator.theme.wins_text_color')}
              setting={'customWinsTextColor'}
              helpImage={helpWinsText}
            />
            <ColorPicker
              text={tl('generator.theme.losses_text_color')}
              setting={'customLossesTextColor'}
              helpImage={helpLossesText}
            />
          </div>
        </div>
      )}

      {/* Background opacity settings */}
      <div className={'settings'}>
        <div className={'setting'}>
          <p>{tl('generator.theme.adjust_opacity')}</p>

          <div className={'flex'} style={{ alignItems: 'center' }}>
            <input
              type={'range'}
              value={settings.get('widgetOpacity')}
              min={0}
              max={1}
              step={0.01}
              onChange={(event) => {
                settings.set(
                  'widgetOpacity',
                  parseFloat(event.currentTarget.value)
                );
              }}
            />

            <p style={{ width: '50px', textAlign: 'right' }}>
              {Math.round(settings.get('widgetOpacity') * 100)}%
            </p>
          </div>
          <small style={{ fontStyle: 'italic' }}>
            {tl('generator.theme.adjust_opacity.requirements')}
          </small>
        </div>
      </div>
    </>
  );
};
