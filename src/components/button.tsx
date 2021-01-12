import React from 'react';

interface Props {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function Button({ onClick, className, children }: Props): JSX.Element {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
