import { Dispatch, useContext, useEffect, useRef } from 'react';
import { LanguageContext } from '../generator/Generator.tsx';
import { AlertTriangleIcon } from '../assets/icons/tabler/AlertTriangleIcon.tsx';

export const RestoreSettingsModal = ({
  open,
  setOpen,
  setUsername,
  restoreDefaults,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  setUsername: Dispatch<string>;
  restoreDefaults: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tl = useContext(LanguageContext);

  useEffect(() => {
    if (open) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [open]);

  if (!tl) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className={'restore-defaults'}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className={'content'}>
        <div className={'modal-icon warning'}>
          <AlertTriangleIcon />
        </div>
        <h1>{tl('modals.generic.are_you_sure')}</h1>
        <p>{tl('modals.restore_defaults.content.0')}</p>
        <br />
        <div className={'buttons'}>
          <button
            onClick={() => {
              setOpen(false);
              restoreDefaults();
              setUsername('paszaBiceps');
              localStorage.removeItem('fcw_generator_settings');
              localStorage.removeItem('fcw_generator_username');
            }}
          >
            {tl('generator.restore_defaults.button')}
          </button>
          <button
            onClick={() => {
              setOpen(false);
            }}
          >
            {tl('modals.buttons.cancel')}
          </button>
        </div>
      </div>
    </dialog>
  );
};
