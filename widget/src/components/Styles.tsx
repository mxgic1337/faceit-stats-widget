import { useContext } from 'react';
import { SettingsContext } from '../../../src/generator/Generator';

export const Styles = ({
  avatar,
  previewBackground,
}: {
  avatar?: string;
  previewBackground?: string;
}) => {
  const SETTINGS = useContext(SettingsContext);

  if (!SETTINGS) {
    return null;
  }

  return (
    <>
      {SETTINGS.get('colorScheme') === 'custom' && (
        <style>{`
                .wrapper {
                    --text: #${SETTINGS.get('customTextColor')} !important;
                    --subtext: #${SETTINGS.get('customSubtextColor')} !important;
                    --text-shadow: #${SETTINGS.get('customTextShadowColor')} !important;
                    --border-1: #${SETTINGS.get('customBorderColor1')} !important;
                    --border-2: #${SETTINGS.get('customBorderColor2')} !important;
                    --border-rotation: 0deg !important;
                    --background: #${SETTINGS.get('customBackgroundColor')} !important;
                    --background-wins: #${SETTINGS.get('customWinsColor')}21 !important;
                    --background-losses: #${SETTINGS.get('customLossesColor')}21 !important;
                    --wins: #${SETTINGS.get('customWinsColor')} !important;
                    --wins-text: #${SETTINGS.get('customWinsTextColor')} !important;
                    --losses: #${SETTINGS.get('customLossesColor')} !important;
                    --losses-text: #${SETTINGS.get('customLossesTextColor')} !important;
                }
            `}</style>
      )}
      {SETTINGS.get('backgroundType') !== 'none' && (
        <style>{`
                .wrapper {
                    --background-image-url: url("${previewBackground || avatar}") !important;
                    --blur-length: ${SETTINGS.get('blurLength')}px;
                    --background-image-opacity: ${SETTINGS.get('backgroundImageOpacity')} !important;
        }
            `}</style>
      )}
      {SETTINGS.get('widgetOpacity') !== 1 && (
        <style>{`.wrapper {
					--background-opacity: ${SETTINGS.get('widgetOpacity')} !important;
				}`}</style>
      )}
    </>
  );
};
