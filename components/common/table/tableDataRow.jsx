import { capitalize, getFullName } from '../../../lib/util';
import Link from 'next/link';
import utilStyles from '../../../styles/utils.module.scss';

const tableDataRow = ({ obj, columns, actions, endpoint, emitMessage, deleteRow }) => {
  const objColumnMap = {};

  columns.forEach((column) => {
    if (column === 'actions') {
      objColumnMap[column] = actions;
    } else {
      objColumnMap[column] = obj[column];
    }
  });

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${getFullName(obj, endpoint)}"?`)) return;

    try {
      const response = await fetch(`/api/${endpoint}/${obj._id}`, { method: 'Delete' });
      if (!response.ok) throw new Error(`Failed to delete ${getFullName(obj, endpoint)}`);
      deleteRow(obj._id);
      emitMessage(null);
    } catch (error) {
      emitMessage(`Failed to delete ${getFullName(obj, endpoint)}`);
    }
  };

  return (
    <tr className="border-t-2 border-neutral-400">
      {Object.entries(objColumnMap).map(([key, value]) => {
        if (key === 'actions') {
          const colOutput = value.map((action) => {
            switch (action) {
              case 'edit':
                return <EditButton key={action} endpoint={endpoint} id={obj._id} />;
              case 'view':
                return <ViewButton key={action} endpoint={endpoint} id={obj._id} />;
              case 'delete':
                return <DeleteButton key={action} handleDelete={handleDelete} />;
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

function EditButton({ endpoint, id }) {
  return (
    <Link href={`/${endpoint}/[_id]/edit`} as={`/${endpoint}/${id}/edit`}>
      <button className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>Edit</button>
    </Link>
  );
}

function ViewButton({ endpoint, id }) {
  return (
    <Link href={`/${endpoint}/[_id]`} as={`/${endpoint}/${id}`}>
      <button className={`${utilStyles.button} bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600`}>View</button>
    </Link>
  );
}

function DeleteButton({ handleDelete }) {
  return (
    <div onClick={handleDelete}>
      <button className={`${utilStyles.button} bg-red-500 focus:ring-red-600/50 hover:bg-red-600`}>Delete</button>
    </div>
  );
}

export default tableDataRow;
