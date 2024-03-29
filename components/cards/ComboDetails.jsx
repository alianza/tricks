import Link from 'next/link';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.scss';
import { formatDate, getFullComboName } from '../../lib/commonUtils';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import TRICK_TYPES, { TRICK_TYPES_MODELS } from '../../models/constants/trickTypes';
import { apiCall, baseStyle, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from 'react-transition-scroll';

export default function ComboDetails({ combo }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (!confirm(`Are you sure you want to delete "${getFullComboName(combo)}"?`)) return;
      await apiCall('combos', { method: 'DELETE', id: router.query._id });
      await router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to delete the combo: ${error.message}`);
    }
  };

  const { trickArray } = combo;

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <h1 className="text-3xl mb-1">{combo.trick}</h1>
      <div className="relative flex flex-wrap gap-2 after:absolute after:-bottom-2 after:w-full after:border-[1px] after:border-neutral-800 after:dark:border-neutral-400">
        {trickArray.map((trick, index) => (
          <div key={trick._id + index} className="flex gap-2">
            <span className="whitespace-nowrap font-bold">{trick.trick}</span>
            {trickArray[index + 1] ? (
              <ArrowRightIcon title="To" className="h-6 w-6" />
            ) : (
              trick.trickRef === TRICK_TYPES_MODELS[TRICK_TYPES.flatground] && <span className="font-bold"> Out </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2>
          <b className="mr-1">Full Combo Name:</b>
          {combo.trick}
        </h2>
      </div>
      <div className="mt-2">
        <p>
          <b className="mr-1">Created at:</b>
          {formatDate(combo.createdAt, { includeTime: true })}
        </p>
        <p>
          <b className="mr-1">Updated at:</b>
          {formatDate(combo.updatedAt, { includeTime: true })}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/combos/${combo._id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>
          Edit
        </Link>
        <button onClick={handleDelete} className={`${utilStyles.button} ${utilStyles.red}`}>
          Delete
        </button>
      </div>
    </TransitionScroll>
  );
}

ComboDetails.propTypes = {
  combo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    trick: PropTypes.string.isRequired,
    trickArray: PropTypes.arrayOf(PropTypes.object).isRequired,
    userId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};
