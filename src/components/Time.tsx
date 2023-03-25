import React, { PropsWithChildren } from 'react';

function Time({ children }: PropsWithChildren): JSX.Element {
  return <div className="w-14">{children}</div>;
}

export default Time;
