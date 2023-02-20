import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import utilStyles from '../../styles/utils.module.scss';
import { capitalize, getFullGrindName } from '../../lib/util';
import PropTypes from 'prop-types';

export default function GrindCard({ grind, mode }) {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${getFullGrindName(grind)}"?`)) return;

    try {
      await fetch(`/api/grinds/${router.query._id}`, { method: 'Delete' });
      await router.push('/');
    } catch (error) {
      setMessage('Failed to delete the grind.');
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
        <div className="flex h-full flex-col content-between justify-between overflow-y-auto p-6 pb-16 overflow-x-hidden scrollbar-thin scrollbar-thumb-neutral-400">
          <div className="flex flex-col">
            <Link href={`/grind/${grind._id}`}>
              <h1 className="text-2xl font-bold text-neutral-900 hover:underline">{getFullGrindName(grind)}</h1>
            </Link>
            <h3 className="text-xl font-bold text-neutral-600">Skater stance: {capitalize(grind.preferred_stance)}</h3>
          </div>

          {grind.stance === 'regular' && (
            <h3 className="text-lg font-bold text-neutral-600">Grind stance: {capitalize(grind.stance)}</h3>
          )}
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/grind/[_id]/edit" as={`/grind/${grind._id}/edit`}>
            <button className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>
              Edit
            </button>
          </Link>
          {mode === 'view' && (
            <Link href="/grind/[_id]" as={`/grind/${grind._id}`}>
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
      {message && <p>{message}</p>}
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
    link: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image_url: PropTypes.string,
  }).isRequired,
  mode: PropTypes.oneOf(['view', 'delete']).isRequired,
};
