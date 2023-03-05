import { capitalize } from '../../../lib/util';
import Link from 'next/link';
import utilStyles from '../../../styles/utils.module.scss';

export const EditButton = ({ endpoint, id }) => (
  <Link
    href={`/${endpoint}/[_id]/edit`}
    as={`/${endpoint}/${id}/edit`}
    className={`${utilStyles.button} ${utilStyles.green}`}
  >
    Edit
  </Link>
);

export const ViewButton = ({ endpoint, id }) => (
  <Link href={`/${endpoint}/[_id]`} as={`/${endpoint}/${id}`} className={`${utilStyles.button} ${utilStyles.blue}`}>
    View
  </Link>
);

export const DeleteButton = ({ handleDelete }) => (
  <button onClick={handleDelete} className={`${utilStyles.button} ${utilStyles.red}`}>
    Delete
  </button>
);

const tableDataRow = ({ obj, columns, actions, endpoint, deleteRow }) => {
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
            switch (action) {
              case 'edit':
                return <EditButton key={action} endpoint={endpoint} id={obj._id} />;
              case 'view':
                return <ViewButton key={action} endpoint={endpoint} id={obj._id} />;
              case 'delete':
                return <DeleteButton key={action} handleDelete={() => deleteRow(obj)} />;
              default:
                return null;
            }
          });

          return (
            <td key={key} className="p-3 sm:p-4">
              <div className="flex justify-center gap-2">{colOutput}</div>
            </td>
          );
        }

        if (key === 'trick') {
          return (
            <td key={key} className="p-3 text-sm font-bold sm:p-4">
              {value}
            </td>
          );
        }

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
