import { useEffect, useState } from 'react';
import { capitalize } from '../../../lib/util';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import TableDataRow from './tableDataRow';

const Table = ({ objArray, columns, actions, endpoint }) => {
  const [columnSortDirectionMap, setColumnSortDirectionMap] = useState({});
  const [objArrayState, setObjArrayState] = useState(objArray);
  const [message, setMessage] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  columns = actions.length ? [...columns, 'actions'] : columns;

  useEffect(() => {
    sort(columns[0], 'asc'); // Default sort on first column
    if (!objArrayState.length) setIsEmpty(true);
  }, [objArrayState]);

  const sort = (column, direction) => {
    setObjArrayState(
      objArrayState.sort((a, b) => {
        if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
        if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
        return 0;
      })
    );
    setColumnSortDirectionMap({ [column]: direction });
  };

  return (
    <>
      <table className="mx-auto table-auto">
        <thead className="bg-neutral-200 dark:bg-neutral-700">
          <tr>
            {columns.map((column) => (
              <th key={column.toString()} className="p-3 sm:p-4">
                <div className={`flex justify-center gap-2`}>
                  <p>{capitalize(column)}</p>
                  {columnSortDirectionMap[column] === 'asc' && (
                    <ChevronDownIcon onClick={() => sort(column, 'desc')} className="h-6 w-6 cursor-pointer" />
                  )}
                  {columnSortDirectionMap[column] === 'desc' && (
                    <ChevronUpIcon onClick={() => sort(column, 'asc')} className="h-6 w-6 cursor-pointer" />
                  )}
                  {column !== 'actions' && !columnSortDirectionMap[column] && (
                    <ChevronUpDownIcon onClick={() => sort(column, 'asc')} className="h-6 w-6 cursor-pointer" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-neutral-50 dark:bg-neutral-800">
          {isEmpty && (
            <tr>
              <td className="p-2 text-center sm:p-4" colSpan={columns.length}>{`No ${endpoint} yet...`}</td>
            </tr>
          )}
          {objArrayState.map((obj) => (
            <TableDataRow
              key={obj._id}
              obj={obj}
              columns={columns}
              actions={actions}
              endpoint={endpoint}
              emitMessage={(message) => setMessage(message)}
              deleteRow={(id) => setObjArrayState(objArrayState.filter((obj) => obj._id !== id))}
            />
          ))}
        </tbody>
      </table>
      {message && <p className="mx-auto my-2 font-bold text-red-500">{message}</p>}
    </>
  );
};

export default Table;
