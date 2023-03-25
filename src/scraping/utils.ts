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
