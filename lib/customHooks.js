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
 * @param queryParam {string} - the query string parameter to check for
 * @returns {void}
 */
export function useCloseAfterQueryParam(queryParam) {
  const router = useRouter();
  useEffect(() => {
    return () => {
      if (router.query[queryParam]) {
        window.close();
      }
    };
  }, [router]);
}
