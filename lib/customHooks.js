import { useEffect } from 'react';

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
