import { colorSchemes, styles } from '../../../widget/src/styles/styles';
import { ColorPicker } from '../../components/ColorPicker.tsx';
import { useContext, useRef } from 'react';
import { Checkbox } from '../../components/Checkbox.tsx';
import { InfoBox } from '../../components/InfoBox.tsx';
import { LanguageContext, SettingsContext } from '../Generator.tsx';

export const StyleTab = ({
  username,
  playerBanner,
}: {
  username: string;
  playerBanner?: string;
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
        {/* Banner background settings */}

        <Checkbox
          text={tl('generator.theme.banner_as_background')}
          setting={'useBannerAsBackground'}
        />

        {settings.get('useBannerAsBackground') && (
          <>
            <Checkbox
              text={tl('generator.theme.banner_as_background.adjust_opacity')}
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
                      {tl(
                        'generator.theme.banner_as_background.readability_warning'
                      )}
                    </p>
                  }
                />
              )}
            {!playerBanner && (
              <InfoBox
                style={'info'}
                content={
                  <p>
                    {tl('generator.theme.banner_as_background.no_banner', [
                      username,
                    ])}
                  </p>
                }
              />
            )}
          </>
        )}
      </div>

      {/* Custom color scheme settings */}

      {settings.get('colorScheme') === 'custom' && (
        <div className={'settings'}>
          <div className={'setting'}>
            <ColorPicker
              text={tl('generator.theme.border_color_1')}
              setting={'customBorderColor1'}
            />
            <ColorPicker
              text={tl('generator.theme.border_color_2')}
              setting={'customBorderColor2'}
            />
            <ColorPicker
              text={tl('generator.theme.text_color')}
              setting={'customTextColor'}
            />
            <ColorPicker
              text={tl('generator.theme.background_color')}
              setting={'customBackgroundColor'}
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
