import { ReactNode } from 'react';
import { AlertTriangleIcon } from '../assets/icons/tabler/AlertTriangleIcon';
import { InfoCircleIcon } from '../assets/icons/tabler/InfoCircleIcon';

export const InfoBox = ({
  content,
  style,
}: {
  content: ReactNode;
  style: 'info' | 'warn' | 'severe';
}) => {
  return (
    <div className={`box ${style}`}>
      {style === 'info' ? <InfoCircleIcon /> : null}
      {style === 'warn' ? <AlertTriangleIcon /> : null}
      {content}
    </div>
  );
};
