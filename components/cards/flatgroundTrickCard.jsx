import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import utilStyles from '../../styles/utils.module.scss';
import { capitalize, getFullTrickName } from '../../lib/util';
import PropTypes from 'prop-types';

export default function FlatgroundTrickCard({ flatgroundTrick: trick, mode = 'view' || 'delete' }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${getFullTrickName(trick)}"?`)) return;

    try {
      const response = await fetch(`/api/flatgroundtricks/${router.query._id}`, { method: 'Delete' });
      if (!response.ok) throw new Error('Failed to delete the flatground trick.');
      await router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div key={trick._id} className="group relative aspect-[4/5] max-w-[20rem] overflow-hidden rounded-3xl">
      <img
        alt={`Image of ${trick.name}`}
        className="h-full w-full object-cover"
        src={trick.image_url || '/placeholder.webp'}
      />
      <h5 className="text-shadow absolute bottom-0 p-4 text-2xl text-neutral-50 shadow-neutral-900 transition-opacity group-hover:opacity-0">
        {getFullTrickName(trick)}
      </h5>
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="flex h-full flex-col content-between justify-between overflow-y-auto p-6 pb-16 overflow-x-hidden scrollbar-thin scrollbar-thumb-neutral-400">
          <div className="flex flex-col">
            <Link href="/flatgroundtricks/[_id]" as={`/flatgroundtricks/${trick._id}`}>
              <h1 className="text-2xl font-bold text-neutral-900 hover:underline">{getFullTrickName(trick)}</h1>
            </Link>
            <h3 className="text-xl font-bold text-neutral-600">Skater stance: {capitalize(trick.preferred_stance)}</h3>
          </div>

          {trick.stance === 'regular' && (
            <h3 className="text-lg font-bold text-neutral-600">Trick stance: {capitalize(trick.stance)}</h3>
          )}
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/flatgroundtricks/[_id]/edit" as={`/flatgroundtricks/${trick._id}/edit`}>
            <button className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>
              Edit
            </button>
          </Link>
          {mode === 'view' && (
            <Link href="/flatgroundtricks/[_id]" as={`/flatgroundtricks/${trick._id}`}>
              <button className={`${utilStyles.button} bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600`}>
                View
              </button>
            </Link>
          )}
          {mode === 'delete' && (
            <div onClick={handleDelete}>
              <button className={`${utilStyles.button} bg-red-500 focus:ring-red-600/50 hover:bg-red-600`}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

FlatgroundTrickCard.propTypes = {
  flatgroundTrick: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    preferred_stance: PropTypes.string.isRequired,
    stance: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    rotation: PropTypes.number.isRequired,
  }).isRequired,
  mode: PropTypes.oneOf(['view', 'delete']),
};
