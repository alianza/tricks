import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * A wrapper for useEffect that allows for async functions
 * @param asyncEffect {function}
 * @param dependencies {any[]}
 */
export const useAsyncEffect = (asyncEffect, dependencies) => {
  useEffect(() => {
    asyncEffect();
  }, dependencies);
};

/**
 * A hook that closes the window after adding a new item according to the query string
 * @returns {void}
 */
export function useCloseAfterAdd(queryParam = null) {
  const router = useRouter();
  useEffect(() => {
    return () => {
      const param = queryParam ? queryParam : 'closeAfterAdd';
      if (router.query[param]) {
        window.close();
      }
    };
  }, [router]);
}
