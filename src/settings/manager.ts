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
  defaultValue: SettingValue;
  defaultWidgetValue?: SettingValue;
};

export type Settings = { [K in SettingKey]: SettingValueType<K> };

/**
 * @param useWidgetDefaults If true, uses `defaultWidgetValue` instead of `defaultValue`
 */
export function useSettings(useWidgetDefaults?: boolean) {
  const [searchParams] = useSearchParams();

  const [settings, setSettings] = useState<Settings>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Object.entries(SETTINGS_DEFINITIONS) as [SettingKey, any][]).reduce(
      (acc, [key, val]) => {
        acc[key] = val.defaultValue;
        if (
          useWidgetDefaults &&
          (SETTINGS_DEFINITIONS[key] as { defaultWidgetValue?: boolean })
            .defaultWidgetValue !== undefined
        ) {
          acc[key] = val.defaultWidgetValue;
        }
        return acc;
      },
      {} as Partial<Settings>
    ) as Settings;
  });

  const setSetting = useCallback(
    <K extends SettingKey>(key: K, value: SettingValueType<K>): boolean => {
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
            newSettings[key] = number;
          }
        } else if (definition.type === 'boolean') {
          newSettings[key] = queryVal === 'true';
        } else {
          newSettings[key] = queryVal;
        }
      });
    });
    setSettings({ ...settings, ...newSettings });
  }, [searchParams, settings]);

  const getSetting = useCallback(
    <K extends SettingKey>(key: K | string): SettingValueType<K> => {
      return settings[key as K] as SettingValueType<K>;
    },
    [settings]
  );

  return {
    settings,
    getSetting,
    setSetting,
    loadSettingsFromQuery,
  };
}
