import {Language, tl} from "../../translations/translations.ts";
import {Dispatch, useEffect, useRef} from "react";

export const GeneratedWidgetModal = ({language, url, setURL}: {
  language: Language,
  url: string | undefined,
  setURL: Dispatch<string | undefined>
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

  return <dialog ref={dialogRef} className={'generated'} onClose={() => {
    setURL(undefined);
  }}>
    <div className={'content'}>
      <h1>{tl(language, 'modals.generated.title')}</h1>
      <p>{tl(language, 'generator.generate.info.0')}</p>
      <p>{tl(language, 'generator.generate.info.1')}</p>
      <input readOnly={true} value={url}/>
      <div className={'buttons'}>
        <button onClick={() => {
          urlInputRef?.current?.select();
          urlInputRef?.current?.setSelectionRange(0, 99999);

          navigator.clipboard.writeText(urlInputRef.current?.value || url || "").then();
        }}>{tl(language, 'modals.buttons.copy')}</button>
        <button onClick={() => {
          setURL(undefined)
        }}>{tl(language, 'modals.buttons.close')}</button>
      </div>
    </div>
    <div>
      <iframe src={url} className={'generated-preview'}></iframe>
    </div>
  </dialog>
}