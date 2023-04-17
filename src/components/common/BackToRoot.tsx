import React from 'react';
import Link from 'next/link';

function BackToRoot(): JSX.Element {
  return (
    <div className="mb-2 sm:-ml-3">
      <Link href="/">
        <span>‹</span> Tilbake til hovedsiden
      </Link>
    </div>
  );
}

export default BackToRoot;
