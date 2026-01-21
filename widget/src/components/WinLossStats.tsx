import { useContext } from 'react';
import { Statistic } from '../components/Statistic.tsx';
import { LanguageContext } from '../../../src/generator/Generator.tsx';

export const WinLossStats = ({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}) => {
  const tl = useContext(LanguageContext);

  if (!tl) {
    return null;
  }

  return (
    <div className={'matches'}>
      <div className={'stats'}>
        <Statistic
          color={'green'}
          value={String(wins)}
          text={tl('widget.wins')}
        />
        <Statistic
          color={'red'}
          value={String(losses)}
          text={tl('widget.losses')}
        />
      </div>
    </div>
  );
};
