import { useContext } from 'react';
import { SettingKey } from '../settings/manager';
import { LanguageContext, SettingsContext } from '../generator/Generator';
import { Tooltip } from './Tooltip';
import { HelpIcon } from '../assets/icons/tabler/HelpIcon';

export const ColorPicker = ({
  text,
  setting,
  helpImage
}: {
  text: string;
  setting: SettingKey;
  helpImage?: string;
}) => {
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);

  if (!tl || !settings) {
    return null;
  }

  return (
    <div className={'color-picker'}>
      <p>{text} {helpImage && <span className={'badge help'}>
        <Tooltip
          content={
            <>
              <img src={helpImage} />
              <p>{tl('generator.theme.custom_color_help')}</p>
            </>
          }
        >
          <HelpIcon />
        </Tooltip>
      </span>}</p>
      <input
        type={'color'}
        onChange={(e) =>
          settings.set(setting, e.currentTarget.value.substring(1))
        }
        value={`#${settings.get(setting)}`}
      />
    </div>
  );
};
