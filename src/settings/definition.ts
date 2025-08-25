import { colorSchemes, styles } from '../../widget/src/styles/styles';
import { languages } from '../translations/translations';
import { SettingDefinition } from './manager';

const HEX_REGEXP = /^[0-9a-fA-F]{3,8}$/;

export const SETTINGS_DEFINITIONS = {
  widgetLanguage: {
    type: 'string_undefined',
    defaultValue: undefined,
    options: [...languages.map((language) => language.id), undefined],
    query: ['lang'],
  },
  playerId: {
    type: 'string',
    defaultValue: undefined,
    query: ['player_id'],
  },
  autoWidth: {
    type: 'boolean',
    defaultValue: true,
    defaultWidgetValue: false,
    query: ['auto_width'],
  },
  onlyOfficialMatchesCount: {
    type: 'boolean',
    defaultValue: true,
    query: ['only_official'],
  },
  showRanking: {
    type: 'ranking_state',
    defaultValue: 2,
    defaultWidgetValue: 0,
    query: ['ranking'],
  },
  showEloDiff: {
    type: 'boolean',
    defaultValue: true,
    query: ['diff'],
  },
  showUsername: {
    type: 'boolean',
    defaultValue: true,
    query: ['name'],
  },
  showEloSuffix: {
    type: 'boolean',
    defaultValue: true,
    query: ['suffix'],
  },
  showStatistics: {
    type: 'boolean',
    defaultValue: true,
    defaultWidgetValue: false,
    query: ['show_stats', 'avg'],
  },
  showEloProgressBar: {
    type: 'boolean',
    defaultValue: true,
    defaultWidgetValue: false,
    query: ['progress', 'eloBar'],
  },
  useBannerAsBackground: {
    type: 'boolean',
    defaultValue: true,
    defaultWidgetValue: false,
    query: ['banner'],
  },
  adjustBackgroundOpacity: {
    type: 'boolean',
    defaultValue: false,
  },
  backgroundOpacity: {
    type: 'number',
    defaultValue: 0.15,
    min: 0,
    max: 1,
    query: ['banner_opacity'],
    requirements: [
      {
        setting: 'adjustBackgroundOpacity',
        value: true,
      },
    ],
  },
  refreshInterval: {
    type: 'number',
    defaultValue: 30,
    min: 10,
    max: 60,
    query: ['refresh'],
  },
  colorScheme: {
    type: 'string',
    defaultValue: 'dark',
    options: colorSchemes,
    query: ['scheme'],
  },
  style: {
    type: 'string',
    defaultValue: 'normal',
    options: styles.map((style) => style.id),
    query: ['style'],
  },
  customBorderColor1: {
    type: 'string',
    defaultValue: '595959',
    regex: HEX_REGEXP,
    query: ['border1'],
    requirements: [
      {
        setting: 'colorScheme',
        value: 'custom',
      },
    ],
  },
  customBorderColor2: {
    type: 'string',
    defaultValue: '8d8d8d',
    regex: HEX_REGEXP,
    query: ['border2'],
    requirements: [
      {
        setting: 'colorScheme',
        value: 'custom',
      },
    ],
  },
  customTextColor: {
    type: 'string',
    defaultValue: 'ffffff',
    regex: HEX_REGEXP,
    query: ['color'],
    requirements: [
      {
        setting: 'colorScheme',
        value: 'custom',
      },
    ],
  },
  customBackgroundColor: {
    type: 'string',
    defaultValue: '121212',
    regex: HEX_REGEXP,
    query: ['bg_color', 'bg-color'],
    requirements: [
      {
        setting: 'colorScheme',
        value: 'custom',
      },
    ],
  },
  statSlot1: {
    type: 'statistic_type',
    defaultValue: 'KILLS',
  },
  statSlot2: {
    type: 'statistic_type',
    defaultValue: 'KD',
  },
  statSlot3: {
    type: 'statistic_type',
    defaultValue: 'HSPERCENT',
  },
  statSlot4: {
    type: 'statistic_type',
    defaultValue: 'WINRATIO',
  },
  saveSession: {
    type: 'boolean',
    defaultValue: false,
    query: ['save_session'],
  },
  averageStatsMatchCount: {
    type: 'number',
    defaultValue: 30,
    query: ['avg_matches'],
  },
  widgetOpacity: {
    type: 'number',
    defaultValue: 1,
    min: 0,
    max: 1,
    query: ['opacity'],
  },
  customCSS: {
    type: 'string_undefined',
    defaultValue: undefined,
    query: ['css'],
  },
} satisfies Record<string, SettingDefinition>;
