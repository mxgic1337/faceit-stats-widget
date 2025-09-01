import { CheckIcon } from '../assets/icons/tabler/CheckIcon.tsx';
import { Language, tl } from '../translations/translations.ts';
import { Dispatch, useEffect, useRef } from 'react';
import { InfoBox } from './InfoBox.tsx';

export const GeneratedWidgetModal = ({
  language,
  url,
  setURL,
}: {
  language: Language;
  url: string | undefined;
  setURL: Dispatch<string | undefined>;
}) => {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (url) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [url]);

  return (
    <dialog
      ref={dialogRef}
      className={'generated'}
      onClose={() => {
        setURL(undefined);
      }}
    >
      <div className={'content'}>
        <div className={'modal-icon success'}>
          <CheckIcon />
        </div>
        <h1>{tl(language, 'modals.generated.title')}</h1>
        <p>{tl(language, 'generator.generate.info.0')}</p>
        <br />
        {import.meta.env.VITE_IS_TESTING && (
          <InfoBox
            content={<p>{tl(language, 'generator.testing')}</p>}
            style={'info'}
          />
        )}
        <input readOnly={true} value={url} />
        <div className={'buttons'}>
          <button
            onClick={() => {
              urlInputRef?.current?.select();
              urlInputRef?.current?.setSelectionRange(0, 99999);

              navigator.clipboard
                .writeText(urlInputRef.current?.value || url || '')
                .then();
            }}
          >
            {tl(language, 'modals.buttons.copy')}
          </button>
          <button
            onClick={() => {
              setURL(undefined);
            }}
          >
            {tl(language, 'modals.buttons.close')}
          </button>
        </div>
      </div>
    </dialog>
  );
};
