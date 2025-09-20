import { Dispatch, useContext } from 'react';
import { LanguageContext, SettingsContext } from '../generator/Generator.tsx';
import { SettingKey } from '../settings/manager.ts';
import { CheckIcon } from '../assets/icons/tabler/CheckIcon.tsx';
import { HelpIcon } from '../assets/icons/tabler/HelpIcon.tsx';
export const Checkbox = ({
  text,
  setting,
  state,
  setState,
  experimental,
  helpTitle,
}: {
  text: string;
  setting?: SettingKey;
  state?: boolean;
  setState?: Dispatch<boolean>;
  experimental?: boolean;
  helpTitle?: string;
}) => {
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);

  if (!tl || !settings) {
    return null;
  }

  return (
    <div
      className={'checkbox'}
      onClick={
        state && setState
          ? () => setState(!state)
          : setting
            ? () => {
                settings.set(setting, !(settings.get(setting) as boolean));
              }
            : () => {}
      }
    >
      <div
        className={`check${state || (setting && settings.get(setting)) ? ' checked' : ''}`}
      >
        <CheckIcon />
      </div>
      <p>
        {text}
        {experimental && (
          <span className={'badge'} title={tl('generator.experimental.help')}>
            {tl('generator.experimental')}
          </span>
        )}
        {helpTitle && (
          <span className={'badge help'} title={helpTitle}>
            <HelpIcon />
          </span>
        )}
      </p>
    </div>
  );
};
