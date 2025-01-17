import { Dispatch, useContext } from 'react';
import { LanguageContext } from '../generator/Generator.tsx';
export const Checkbox = ({
  text,
  state,
  setState,
  experimental,
  helpTitle,
}: {
  text: string;
  state: boolean;
  setState: Dispatch<boolean>;
  experimental?: boolean;
  helpTitle?: string;
}) => {
  const tl = useContext(LanguageContext);

  if (!tl) {
    return null;
  }

  return (
    <div className={'checkbox'} onClick={() => setState(!state)}>
      <div className={`check${state ? ' checked' : ''}`}></div>
      <p>
        {text}
        {experimental && (
          <span className={'badge'} title={tl('generator.experimental.help')}>
            {tl('generator.experimental')}
          </span>
        )}
        {helpTitle && (
          <span className={'badge help'} title={helpTitle}>
            ?
          </span>
        )}
      </p>
    </div>
  );
};
