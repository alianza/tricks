import { shallowEqual } from '../../lib/commonUtils';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import Accordion from '../../lib/accordion';

function Filters({ filters = {}, onReset, children }) {
  const [defaultFilters, setDefaultFilters] = useState(undefined);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (!defaultFilters) setDefaultFilters(filters);

    if (detailsRef.current) {
      new Accordion(detailsRef.current);
    }
  }, []);

  return (
    <details ref={detailsRef} className="rounded-lg bg-neutral-50 p-4 shadow-lg dark:bg-neutral-800">
      <summary className="cursor-pointer text-xl font-medium">Filters</summary>
      <div data-contents="">
        <hr className="my-4 border-neutral-800 dark:border-neutral-400" />
        <div className="flex flex-wrap items-center gap-4">
          {children}
          {!shallowEqual(filters, defaultFilters) && (
            <button
              title="Reset filters"
              className="ml-auto p-2 transition-transform hover:scale-110 hover:duration-100 active:scale-95"
              onClick={onReset}
            >
              <ArrowPathIcon className="h-6 w-6"></ArrowPathIcon>
            </button>
          )}
        </div>
      </div>
    </details>
  );
}

export default Filters;
