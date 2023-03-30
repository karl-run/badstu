import { JSDOM } from 'jsdom';

export async function fullyLoadDom(url: string, waitForClass: string): Promise<JSDOM> {
  const dom = await getDom(url);
  await waitFor(() => dom.window.document.getElementsByClassName(waitForClass).length > 0);
  return dom;
}

async function getDom(url: string): Promise<JSDOM> {
  if (process.env.NODE_ENV === 'development' && (global as any).cache?.[url]) {
    console.info(`Using cached times for ${url}`);
    return (global as any).cache[url];
  }

  const jsdom = await JSDOM.fromURL(url, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: 'usable',
  });

  if (process.env.NODE_ENV === 'development') {
    if ((global as any).cache == undefined) (global as any).cache = {};
    (global as any).cache[url] = jsdom;
  }

  return jsdom;
}

export async function waitFor<T>(predicate: () => T | undefined): Promise<T> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const result = predicate();
      if (result) {
        clearInterval(interval);
        resolve(result);
      }
    }, 100);
  });
}
