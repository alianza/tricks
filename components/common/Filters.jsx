import { shallowEqual } from '../../lib/commonUtils';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import Accordion from '../../lib/accordion';

function Filters({ filters = {}, onReset, children }) {
  const [defaultFilters, setDefaultFilters] = useState(undefined);
  const detailsRef = useRef();
  const filtersChanged = !shallowEqual(filters, defaultFilters);

  useEffect(() => {
    if (!defaultFilters) setDefaultFilters(filters);

    if (detailsRef.current) {
      new Accordion(detailsRef.current);
    }
  }, []);

  useEffect(() => {
    if (defaultFilters && filtersChanged) {
      detailsRef.current.open = true; // Open the details element if filters have changed from the default (first render with search params)
    }
  }, [filters]);

  return (
    <details ref={detailsRef} className="rounded-lg bg-neutral-50 p-4 shadow-md dark:bg-neutral-800">
      <summary className="cursor-pointer text-xl font-medium">Filters</summary>
      <div>
        {/* Mandatory content </div> for the Accordion component to work */}
        <hr className="my-4 border-neutral-800 dark:border-neutral-400" />
        <div className="flex flex-wrap items-center gap-4">
          {children}
          {filtersChanged && (
            <button
              title="Reset filters"
              className="ml-auto p-2 transition-transform hover:scale-110 hover:duration-100 active:scale-95"
              onClick={onReset}
            >
              <ArrowPathIcon className="size-6" />
            </button>
          )}
        </div>
      </div>
    </details>
  );
}

export default Filters;
