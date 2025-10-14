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
            href={'https://github.com/mxgic1337/faceit-stats-widget/issues'}
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
        <small>
          {import.meta.env.VITE_COMMIT && (
            <span>
              <a
                href={`https://github.com/mxgic1337/faceit-stats-widget/commit/${import.meta.env.VITE_COMMIT}`}
                target={'_blank'}
              >
                {import.meta.env.VITE_COMMIT.substring(0, 7)}
              </a>{' '}
              &bull;{' '}
            </span>
          )}
          v{packageJSON.version}
        </small>
      </div>
    </footer>
  );
};
