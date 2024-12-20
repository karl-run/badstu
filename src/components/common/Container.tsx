import React, { PropsWithChildren, ReactElement } from 'react';

import { cn } from '@/utils/cn';

interface Props {
  className?: string;
}

function Container({ className, children }: PropsWithChildren<Props>): ReactElement {
  return (
    <main className={cn('container mx-auto p-4 pt-0 sm:p-16 sm:pt-2', className)}>{children}</main>
  );
}

export default Container;
