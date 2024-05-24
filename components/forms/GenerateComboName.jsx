import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import TRICK_TYPES_MAP, { TRICK_TYPES_MODELS } from '../../models/constants/trickTypes';

function GenerateComboName({ trickArray }) {
  const [trickArrayRef] = useAutoAnimate();
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => setDots((prev) => (prev === '...' ? '.' : prev + '.')), 1000);
    return () => clearInterval(interval);
  });

  return (
    <div ref={trickArrayRef} className="relative mt-4 flex flex-wrap gap-2">
      {trickArray.map((trick, index) => (
        <div key={trick._id + index} className="flex gap-2">
          <span className="whitespace-nowrap font-bold">{trick.trick}</span>
          {trickArray[index + 1] ? (
            <ArrowRightIcon title="To" className="size-6" />
          ) : (
            trick.trickRef === TRICK_TYPES_MODELS[TRICK_TYPES_MAP.flatground] &&
            trickArray.length > 1 && <span className="font-bold"> Out </span>
          )}
          {trickArray.length === 1 && (
            <span className="font-bold">
              <ArrowRightIcon title="To" className="mr-1 inline-block size-6" />
              {dots}
            </span>
          )}
        </div>
      ))}
      {!trickArray.length && <span className="whitespace-nowrap font-bold">Select first trick{dots}</span>}
    </div>
  );
}

export default GenerateComboName;
