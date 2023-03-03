import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import utilStyles from '../../styles/utils.module.scss';
import { capitalize, getFullGrindName } from '../../lib/util';
import PropTypes from 'prop-types';

export default function GrindCard({ grind, mode }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${getFullGrindName(grind)}"?`)) return;

    try {
      const response = await fetch(`/api/grinds/${router.query._id}`, { method: 'Delete' });
      if (!response.ok) throw new Error('Failed to delete the grind.');
      await router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div key={grind._id} className="group relative aspect-[4/5] max-w-[20rem] overflow-hidden rounded-3xl">
      <img
        alt={`Image of ${grind.name}`}
        className="h-full w-full object-cover"
        src={grind.image_url || '/placeholder.webp'}
      />
      <h5 className="text-shadow absolute bottom-0 p-4 text-2xl text-neutral-50 shadow-neutral-900 transition-opacity group-hover:opacity-0">
        {getFullGrindName(grind)}
      </h5>

      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="flex h-full flex-col content-between justify-between overflow-y-auto overflow-x-hidden p-6 pb-16">
          <div className="flex flex-col">
            <Link href={`/grinds/[_id]`} as={`/grinds/${grind._id}`}>
              <h1 className="text-2xl font-bold text-neutral-900 hover:underline">{getFullGrindName(grind)}</h1>
            </Link>
            <h3 className="text-xl font-bold text-neutral-600">Skater stance: {capitalize(grind.preferred_stance)}</h3>
          </div>

          {grind.stance === 'regular' && (
            <h3 className="text-lg font-bold text-neutral-600">Grind stance: {capitalize(grind.stance)}</h3>
          )}
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/grinds/[_id]/edit" as={`/grinds/${grind._id}/edit`}>
            <button className={`${utilStyles.button} bg-green-600 hover:bg-green-700 focus:ring-green-500/50`}>
              Edit
            </button>
          </Link>
          {mode === 'view' && (
            <Link href="/grinds/[_id]" as={`/grinds/${grind._id}`}>
              <button className={`${utilStyles.button} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50`}>
                View
              </button>
            </Link>
          )}
          {mode === 'delete' && (
            <div onClick={handleDelete}>
              <button className={`${utilStyles.button} bg-red-600 hover:bg-red-700 focus:ring-red-500/50`}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

GrindCard.propTypes = {
  grind: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    preferred_stance: PropTypes.string.isRequired,
    stance: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  mode: PropTypes.oneOf(['view', 'delete']).isRequired,
};
