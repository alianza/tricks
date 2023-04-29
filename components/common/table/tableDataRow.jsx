import { capitalize } from '../../../lib/commonUtils';
import Link from 'next/link';
import utilStyles from '../../../styles/utils.module.scss';
import { act } from 'react-dom/test-utils';

export const EditButton = ({ endpoint, id }) => (
  <Link href={`/${endpoint}/${id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>
    Edit
  </Link>
);

export const ViewButton = ({ endpoint, id }) => (
  <Link href={`/${endpoint}/${id}`} className={`${utilStyles.button} ${utilStyles.blue}`}>
    View
  </Link>
);

export const DeleteButton = ({ handleDelete }) => (
  <button onClick={handleDelete} className={`${utilStyles.button} ${utilStyles.red}`}>
    Delete
  </button>
);

const tableDataRow = ({ obj, columns, actions, endpoint, deleteRow, onRowAction }) => {
  const objColumnMap = {};

  columns.forEach((column) => {
    if (column === 'actions') {
      objColumnMap[column] = actions;
    } else {
      objColumnMap[column] = obj[column];
    }
  });

  return (
    <tr className="relative after:absolute after:left-0 after:h-[2px] after:w-full after:bg-neutral-400">
      {Object.entries(objColumnMap).map(([key, value]) => {
        if (key === 'actions') {
          const colOutput = value.map((action) => {
            return (
              <button key={action} onClick={() => onRowAction(action, obj)}>
                {action}
              </button>
            );
          });

          return (
            <td key={key} className="p-3 sm:p-4">
              <div className="flex justify-center gap-2">{colOutput}</div>
            </td>
          );
        }

        if (key === 'trick')
          return (
            <td key={key} className="p-3 text-sm font-bold sm:p-4">
              {value}
            </td>
          );

        return (
          <td key={key} className="p-3 sm:p-4">
            {capitalize(value)}
          </td>
        );
      })}
    </tr>
  );
};

export default tableDataRow;
