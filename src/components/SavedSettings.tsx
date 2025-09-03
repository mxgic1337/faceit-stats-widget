import { useContext, useState } from 'react';
import { LanguageContext, SettingsContext } from '../generator/Generator';
import { Settings } from '../settings/manager';

export function getSettings(): {
  id: number;
  date: string;
  autoSave: boolean;
  settings: Partial<Settings>;
}[] {
  const savedSettings = localStorage.getItem('fcw_saved_settings');
  let savedSettingsList = [];
  if (savedSettings) {
    savedSettingsList = JSON.parse(savedSettings);
  }
  return savedSettingsList;
}

export function saveSettings(settings: Settings, autoSave: boolean) {
  let savedSettingsList = getSettings();
  savedSettingsList.push({
    id:
      savedSettingsList.length > 0
        ? savedSettingsList[savedSettingsList.length - 1].id + 1
        : 0,
    date: new Date().toDateString(),
    autoSave,
    settings,
  });
  localStorage.setItem('fcw_saved_settings', JSON.stringify(savedSettingsList));
}

export const SavedSettings = () => {
  const tl = useContext(LanguageContext);
  const settings = useContext(SettingsContext);
  const [selectedSave, setSelectedSave] = useState('none');
  if (!settings || !tl) return null;

  return (
    <>
      <div className="settings">
        <h4>
          {tl(`generator.saved_settings.title`)}{' '}
          <span className="badge">{tl(`generator.experimental`)}</span>
        </h4>
        <select
          onChange={(e) => {
            setSelectedSave(e.currentTarget.value);
          }}
        >
          <option value="none">
            {tl(`generator.saved_settings.select.none`)}
          </option>
          {getSettings().map((setting) => {
            const date = new Date(setting.date);
            return (
              <option value={setting.id}>
                {tl(`generator.saved_settings.select.save`, [
                  tl(`scheme.${setting.settings.colorScheme || '?'}`),
                  tl(`style.${setting.settings.style || '?'}`),
                  `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
                  setting.autoSave
                    ? tl('generator.saved_settings.autosave')
                    : '',
                ])}
              </option>
            );
          })}
        </select>
        {selectedSave !== 'none' && (
          <div className="buttons">
            <button>{tl(`generator.saved_settings.load_button`)}</button>
            <button>{tl(`generator.saved_settings.delete_button`)}</button>
          </div>
        )}
        <div className="buttons">
          <button
            onClick={() => {
              saveSettings(settings.settings, false);
            }}
          >
            {tl(`generator.saved_settings.save_button`)}
          </button>
        </div>
      </div>
    </>
  );
};
