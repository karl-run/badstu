import React, { PropsWithChildren, ReactElement } from 'react';

function Time({ children }: PropsWithChildren): ReactElement {
  return <div className="w-14">{children}</div>;
}

export default Time;
