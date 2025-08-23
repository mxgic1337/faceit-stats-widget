import { Dispatch, useContext } from 'react';
import { SettingKey } from '../settings/manager';
import { SettingsContext } from '../generator/Generator';

export const ColorPicker = ({
  text,
  setting
}: {
  text: string;
  setting: SettingKey;
}) => {
  const settings = useContext(SettingsContext)

  if (!settings) {
    return null;
  }

  return (
    <div className={'color-picker'}>
      <p>{text}</p>
      <input
        type={'color'}
        onChange={(e) => settings.set(setting, e.currentTarget.value)}
        value={settings.get(setting) as string}
      />
    </div>
  );
};
