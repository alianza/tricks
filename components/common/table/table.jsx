import { useEffect, useRef, useState } from 'react';
import { capitalize, apiCall, getFullName } from '../../../lib/util';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import TableDataRow from './tableDataRow';
import autoAnimate from '@formkit/auto-animate';

const Table = ({ objArray, columns, actions, endpoint, updateLocalState = false }) => {
  const [columnSortDirection, setColumnSortDirection] = useState({});
  const [objArrayState, setObjArrayState] = useState(objArray);
  const [message, setMessage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const tableBodyRef = useRef(null);

  columns = actions.length ? [...columns, 'actions'] : columns; // Add actions column if actions are passed

  useEffect(() => {
    sort(columns[0], 'asc'); // Default ascending sort on first column
    setTimeout(() => tableBodyRef.current && autoAnimate(tableBodyRef.current), 1);
  }, [objArrayState]);

  const sort = (column, direction) => {
    setIsAnimating(true);
    setObjArrayState(
      objArrayState.sort((a, b) => {
        if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
        if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
        return 0;
      })
    );
    setColumnSortDirection({ [column]: direction });
    setTimeout(() => setIsAnimating(false), 250); // default auto-animate duration
  };

  const handleDelete = async (obj) => {
    if (!confirm(`Are you sure you want to delete "${getFullName(obj, endpoint)}"?`)) return;

    try {
      await apiCall(`${endpoint}/`, { method: 'DELETE', id: obj._id });
      const { data } = updateLocalState // get new data from Api or update local state if updateLocalState is true
        ? { data: objArrayState.filter(({ _id }) => _id !== obj._id) }
        : await apiCall(endpoint, { method: 'GET' }); // Update the local data from the API
      setObjArrayState(data);
      setMessage(null);
    } catch (error) {
      setMessage(`Failed to delete ${getFullName(obj, endpoint)}`);
    }
  };

  return (
    <div className={`flex flex-col items-center ${isAnimating ? 'overflow-x-hidden' : 'overflow-x-auto'}`}>
      <table className="relative mx-auto table-auto after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-neutral-400">
        <thead className="bg-neutral-200 dark:bg-neutral-700">
          <tr>
            {columns.map((column) => (
              <th key={column.toString()} className="p-3 sm:p-4">
                <div className={`flex justify-center gap-2`}>
                  <p>{capitalize(column)}</p>
                  {columnSortDirection[column] === 'asc' && (
                    <ChevronDownIcon onClick={() => sort(column, 'desc')} className="h-6 w-6 cursor-pointer" />
                  )}
                  {columnSortDirection[column] === 'desc' && (
                    <ChevronUpIcon onClick={() => sort(column, 'asc')} className="h-6 w-6 cursor-pointer" />
                  )}
                  {column !== 'actions' && !columnSortDirection[column] && (
                    <ChevronUpDownIcon onClick={() => sort(column, 'asc')} className="h-6 w-6 cursor-pointer" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-neutral-50 dark:bg-neutral-800" ref={tableBodyRef}>
          {!objArrayState.length && (
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
              deleteRow={(obj) => handleDelete(obj)}
            />
          ))}
        </tbody>
      </table>
      {message && <p className="my-2 font-bold text-red-500">{message}</p>}
    </div>
  );
};

export default Table;
