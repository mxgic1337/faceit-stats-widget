export const Separator = ({ text }: { text?: string }) => {
  return (
    <div className={'separator'}>
      {text && <p>{text}</p>}
      <hr />
    </div>
  );
};
