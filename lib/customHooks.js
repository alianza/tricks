import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiCall } from './clientUtils';

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

export const useApiCall = (endpoint, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!endpoint) return;
    setLoading(true);
    apiCall(endpoint, options)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, error, loading };
};

/**
 * A hook that closes the window after adding a new item according to the query string
 * @param urlParam {string} - the query string parameter to check for
 * @returns {function} - The function to close the window
 */
export function useCloseOnUrlParam(urlParam) {
  const router = useRouter();

  return function () {
    if (router.query[urlParam]) {
      window.close();
    }
  };
}
