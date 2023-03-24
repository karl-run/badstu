// hook to rerender every n seconds
import { useState } from 'react';

import useInterval from '@/hooks/useInterval';

export const useRerender = (seconds: number) => {
  const [, setTick] = useState(0);
  const tick = () => setTick((tick) => tick + 1);

  useInterval(tick, seconds * 1000);
};
