import Link from 'next/link';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.scss';
import { capitalize, formatDate, getFullTrickName } from '../../lib/commonUtils';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from 'react-transition-scroll';

export default function FlatgroundTrickDetails({ flatgroundTrick: trick }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (!confirm(`Are you sure you want to delete "${getFullTrickName(trick)}"?`)) return;
      await apiCall(`flatgroundtricks`, { method: 'DELETE', id: router.query._id });
      await router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to delete the flatground trick: ${error.message}`);
    }
  };

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <h1 className="text-3xl mb-1">{trick.trick}</h1>
      <h3 className="text-xl">
        <b>Preferred stance:</b> {trick.preferred_stance}
      </h3>
      <div className="mt-4">
        <p>
          <b className="mr-1">Stance:</b>
          {capitalize(trick.stance)}
        </p>
        {trick.direction !== 'none' && (
          <p>
            <b className="mr-1">Direction:</b>
            {capitalize(trick.direction)}
          </p>
        )}
        {trick.rotation !== 0 && (
          <p>
            <b className="mr-1">Rotation:</b>
            {trick.rotation}
          </p>
        )}
        <p>
          <b className="mr-1">Trick:</b>
          {trick.name}
        </p>
      </div>
      <div className="mt-2">
        <p>
          <b className="mr-1">Created at:</b>
          {formatDate(trick.createdAt, { includeTime: true })}
        </p>
        <p>
          <b className="mr-1">Updated at:</b>
          {formatDate(trick.updatedAt, { includeTime: true })}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/flatgroundtricks/${trick._id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>
          Edit
        </Link>
        <button onClick={handleDelete} className={`${utilStyles.button} ${utilStyles.red}`}>
          Delete
        </button>
      </div>
    </TransitionScroll>
  );
}

FlatgroundTrickDetails.propTypes = {
  flatgroundTrick: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    preferred_stance: PropTypes.string.isRequired,
    stance: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    rotation: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    trick: PropTypes.string.isRequired,
  }).isRequired,
};
