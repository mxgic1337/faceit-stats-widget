import packageJSON from '../../package.json';
import { useContext } from 'react';
import { LanguageContext } from '../generator/Generator.tsx';

export const Footer = () => {
  const tl = useContext(LanguageContext);

  if (!tl) {
    return null;
  }

  return (
    <footer>
      <div>
        <small>
          {tl('generator.footer.not_affiliated')}{' '}
          <a href={'https://faceit.com'} target={'_blank'}>
            FACEIT
          </a>
          .
        </small>
        <small>
          <a
            href={
              'https://github.com/mxgic1337/faceit-stats-widget/blob/main/LICENSE'
            }
            target={'_blank'}
          >
            MIT License
          </a>{' '}
          &bull;{' '}
          <a
            href={'https://github.com/mxgic1337/faceit-stats-widget'}
            target={'_blank'}
          >
            GitHub
          </a>{' '}
          &bull;{' '}
          <a
            href={'https://github.com/mxgic1337/faceit-stats-widget/issues/new'}
            target={'_blank'}
          >
            {tl('generator.footer.issues')}
          </a>
        </small>
      </div>
      <div>
        <small>
          Copyright &copy;{' '}
          <a href={'https://github.com/mxgic1337'} target={'_blank'}>
            mxgic1337_
          </a>{' '}
          2025
        </small>
        <small>v{packageJSON.version}</small>
      </div>
    </footer>
  );
};
