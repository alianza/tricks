import { useEffect, useRef, useState } from 'react';
import { capitalize, apiCall, getFullName, sOrNoS } from '../../../lib/commonUtils';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/20/solid';
import TableDataRow from './tableDataRow';
import autoAnimate from '@formkit/auto-animate';
import IconLink from '../IconLink';
import { toast } from 'react-toastify';

const Table = ({ objArray, columns, actions, endpoint, updateLocalState = false, showCount = false, newLink }) => {
  const [columnSortDirection, setColumnSortDirection] = useState({});
  const [objArrayState, setObjArrayState] = useState(objArray);
  const [isAnimating, setIsAnimating] = useState(false);
  const tableBodyRef = useRef(null);

  const singularEntityName = capitalize(endpoint.slice(0, -1) + sOrNoS(objArrayState.length));

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
    try {
      if (!confirm(`Are you sure you want to delete "${getFullName(obj, endpoint)}"?`)) return;
      await apiCall(`${endpoint}/`, { method: 'DELETE', id: obj._id });
      const { data } = updateLocalState // get new data from Api or update local state if updateLocalState is true
        ? { data: objArrayState.filter(({ _id }) => _id !== obj._id) }
        : await apiCall(endpoint, { method: 'GET' }); // Update the local data from the API
      setObjArrayState(data);
    } catch (error) {
      toast.error(`Failed to delete ${getFullName(obj, endpoint)}: ${error.message}`);
    }
  };

  return (
    <div
      className={`flex flex-col items-center overflow-y-hidden ${
        isAnimating ? 'overflow-x-hidden' : 'overflow-x-auto'
      }`}
    >
      <table className="relative mx-auto table-auto">
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
        <tbody
          className="bg-neutral-50 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-neutral-400 dark:bg-neutral-800"
          ref={tableBodyRef}
        >
          {!objArrayState.length && (
            <tr>
              <td className="p-2 sm:p-4" colSpan={columns.length}>
                <div className="flex justify-center gap-2">
                  {`No ${endpoint} yet...`}
                  {newLink && <IconLink title={`New ${singularEntityName}`} href={newLink} Icon={PlusIcon} />}
                </div>
              </td>
            </tr>
          )}
          {objArrayState.map((obj) => (
            <TableDataRow
              key={obj._id}
              obj={obj}
              columns={columns}
              actions={actions}
              endpoint={endpoint}
              emitMessage={(message) => toast.error(message)}
              deleteRow={(obj) => handleDelete(obj)}
            />
          ))}
        </tbody>
        {showCount && objArrayState.length > 0 && (
          <tfoot>
            <tr>
              {newLink && (
                <td>
                  <IconLink title={`New ${singularEntityName}`} label="Add new" href={newLink} Icon={PlusIcon} />
                </td>
              )}
              {columns.length > 2 && <td colSpan={columns.length - (newLink ? 2 : 1)}></td>}
              <td className="text-end">
                {objArrayState.length} {singularEntityName}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Table;
