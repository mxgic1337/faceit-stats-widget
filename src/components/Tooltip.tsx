import { useState } from 'react';

export const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);

  return (
    <span
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      {children}
      <div className={`tooltip ${show ? '' : 'hidden'}`}>{content}</div>
    </span>
  );
};
