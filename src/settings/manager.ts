import { useCallback, useState } from 'react';
import { StatisticType } from '../generator/tabs/StatisticsTab';
import { SETTINGS_DEFINITIONS } from './definition';
import { Language } from '../translations/translations';
import { ShowRanking } from '../../widget/src/widget/Widget';
import { useSearchParams } from 'react-router-dom';

export type SettingValueTypeMap = {
  string: string;
  string_undefined: string | undefined;
  number: number;
  boolean: boolean;
  statistic_type: StatisticType;
  language: Language;
  ranking_state: ShowRanking;
};

export type SettingKey = keyof typeof SETTINGS_DEFINITIONS;

export type SettingValue =
  | string
  | number
  | boolean
  | StatisticType
  | Language
  | ShowRanking
  | undefined;

export type SettingValueType<K extends SettingKey> =
  (typeof SETTINGS_DEFINITIONS)[K]['type'] extends keyof SettingValueTypeMap
    ? SettingValueTypeMap[(typeof SETTINGS_DEFINITIONS)[K]['type']]
    : unknown;

export type SetSettingFunction = <K extends SettingKey>(
  key: K,
  value: SettingValueType<K>
) => boolean;

export type SettingDefinition = {
  type:
    | 'string'
    | 'string_undefined'
    | 'number'
    | 'boolean'
    | 'statistic_type'
    | 'language'
    | 'ranking_state';
  min?: number;
  max?: number;
  regex?: RegExp;
  query?: string[];
  requirements?: { setting: string; value: SettingValue }[];
  hidden?: boolean;
  options?: SettingValue[];
  disabled?: boolean;
  defaultValue: SettingValue;
  defaultWidgetValue?: SettingValue;
};

export type Settings = { [K in SettingKey]: SettingValueType<K> };

/**
 * @param useWidgetDefaults If true, uses `defaultWidgetValue` instead of `defaultValue`
 */
export function useSettings(
  useWidgetDefaults?: boolean,
  loadFromLocalStorage?: boolean
) {
  const [searchParams] = useSearchParams();

  const defaults = useCallback(
    (loadFromLocalStorage?: boolean) => {
      const settingsString = localStorage.getItem('fcw_generator_settings');
      const localStorageSettings: { [key: string]: undefined } | undefined =
        settingsString ? JSON.parse(settingsString) : undefined;
      return (Object.entries(SETTINGS_DEFINITIONS) as [SettingKey, any][]) // eslint-disable-line @typescript-eslint/no-explicit-any
        .reduce((acc, [key, val]) => {
          if ((SETTINGS_DEFINITIONS[key] as { disabled?: boolean }).disabled) {
            return acc;
          }

          acc[key] = val.defaultValue;
          if (
            useWidgetDefaults &&
            (SETTINGS_DEFINITIONS[key] as { defaultWidgetValue?: boolean })
              .defaultWidgetValue !== undefined
          ) {
            acc[key] = val.defaultWidgetValue;
          }
          if (
            loadFromLocalStorage &&
            !useWidgetDefaults &&
            localStorageSettings &&
            localStorageSettings[key] !== undefined
          ) {
            acc[key] = localStorageSettings[key];
          }
          return acc;
        }, {} as Partial<Settings>) as Settings;
    },
    [useWidgetDefaults]
  );

  const [settings, setSettings] = useState<Settings>(
    defaults(loadFromLocalStorage)
  );

  function validateSetting<K extends SettingKey>(
    key: K,
    value: SettingValueType<K>
  ) {
    const definition: SettingDefinition = SETTINGS_DEFINITIONS[key];
    if (
      definition.min !== undefined &&
      definition.max !== undefined &&
      typeof value === 'number'
    ) {
      if (definition.min > value || definition.max < value) {
        return false;
      }
    }

    if (
      definition.regex &&
      typeof value === 'string' &&
      !definition.regex.test(value)
    ) {
      return false;
    }

    if (
      definition.options &&
      !definition.options.includes(value as SettingValue)
    )
      return false;

    return true;
  }

  const setSetting = useCallback(
    <K extends SettingKey>(key: K, value: SettingValueType<K>): boolean => {
      if (!validateSetting(key, value)) return false;
      setSettings({ ...settings, [key]: value });
      return true;
    },
    [settings]
  );

  const loadSettingsFromQuery = useCallback(() => {
    const newSettings: { [key: string]: SettingValue } = {};
    (
      Object.entries(SETTINGS_DEFINITIONS) as [SettingKey, SettingDefinition][]
    ).forEach(([key, definition]) => {
      if (!definition.query || definition.query.length === 0) {
        return;
      }
      definition.query.forEach((query) => {
        const queryVal = searchParams.get(query);
        if (!queryVal) return;
        if (
          definition.type === 'number' ||
          definition.type === 'ranking_state'
        ) {
          const number =
            definition.type === 'ranking_state'
              ? parseInt(queryVal)
              : parseFloat(queryVal);
          if (!isNaN(number)) {
            if (!validateSetting(key, number)) return;
            newSettings[key] = number;
          }
        } else if (definition.type === 'boolean') {
          if (!validateSetting(key, queryVal === 'true')) return;
          newSettings[key] = queryVal === 'true';
        } else {
          if (!validateSetting(key, queryVal)) return;
          newSettings[key] = queryVal;
        }
      });
    });
    setSettings({ ...settings, ...newSettings });
  }, [searchParams, settings]);

  const saveSettingsToLocalStorage = useCallback(() => {
    localStorage.setItem('fcw_generator_settings', JSON.stringify(settings));
  }, [settings]);

  const getSetting = useCallback(
    <K extends SettingKey>(key: K | string): SettingValueType<K> => {
      return settings[key as K] as SettingValueType<K>;
    },
    [settings]
  );

  const restoreDefaults = useCallback(() => {
    setSettings(defaults());
  }, [defaults]);

  return {
    settings,
    getSetting,
    setSetting,
    restoreDefaults,
    loadSettingsFromQuery,
    saveSettingsToLocalStorage,
  };
}
