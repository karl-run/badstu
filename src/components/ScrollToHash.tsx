'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

function ScrollToHash(): null {
  const hasScrolledRef = useRef(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    const param = searchParams?.get('scrollTo');
    if (!param || hasScrolledRef.current) return;

    document.getElementById(param)?.scrollIntoView({ behavior: 'smooth' });
    hasScrolledRef.current = true;
  }, [searchParams]);

  return null;
}

export default ScrollToHash;
