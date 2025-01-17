import { Dispatch, useContext } from 'react';
import { LanguageContext } from '../../generator/Generator.tsx';
export const Checkbox = ({
  text,
  state,
  setState,
  experimental,
}: {
  text: string;
  state: boolean;
  setState: Dispatch<boolean>;
  experimental?: boolean;
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
          <span className={'badge'}>{tl('generator.experimental')}</span>
        )}
      </p>
    </div>
  );
};
