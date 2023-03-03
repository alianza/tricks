import { capitalize } from '../../../lib/util';
import Link from 'next/link';
import utilStyles from '../../../styles/utils.module.scss';

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

export function EditButton({ endpoint, id }) {
  return (
    <Link href={`/${endpoint}/[_id]/edit`} as={`/${endpoint}/${id}/edit`}>
      <button className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>Edit</button>
    </Link>
  );
}

export function ViewButton({ endpoint, id }) {
  return (
    <Link href={`/${endpoint}/[_id]`} as={`/${endpoint}/${id}`}>
      <button className={`${utilStyles.button} bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600`}>View</button>
    </Link>
  );
}

export function DeleteButton({ handleDelete }) {
  return (
    <div onClick={handleDelete}>
      <button className={`${utilStyles.button} bg-red-500 focus:ring-red-600/50 hover:bg-red-600`}>Delete</button>
    </div>
  );
}

export default tableDataRow;
