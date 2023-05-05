import { useEffect, useRef, useState } from 'react';
import { capitalize, sOrNoS } from '../../../lib/commonUtils';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/20/solid';
import TableDataRow from './genericTableDataRow';
import autoAnimate from '@formkit/auto-animate';
import IconLink from '../IconLink';
import { toast } from 'react-toastify';

const GenericTable = ({ objArray, columns, actions, entityName, onAction, showCount = false, newLink }) => {
  const [columnSortDirection, setColumnSortDirection] = useState({});
  const [objArrayState, setObjArrayState] = useState(objArray);
  const [isAnimating, setIsAnimating] = useState(false);
  const tableBodyRef = useRef(null);

  const columnNames = columns.map((columnObj) => (typeof columnObj === 'string' ? columnObj : Object.keys(columnObj)[0]));

  if (actions.length) {
    columnNames.push('actions');
    columns = [...columns, 'actions'];
  }

  useEffect(() => {
    sort(columnNames[0], 'asc'); // Default ascending sort on first column
  }, []);

  useEffect(() => {
    setTimeout(() => tableBodyRef.current && autoAnimate(tableBodyRef.current), 1);
  }, [objArrayState]);

  useEffect(() => {
    setObjArrayState(objArray);
  }, [objArray]);

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

  return (
    <div className={`flex flex-col items-center overflow-y-hidden ${isAnimating ? 'overflow-x-hidden' : 'overflow-x-auto'}`}>
      <table className="relative mx-auto table-auto">
        <thead className="bg-neutral-200 dark:bg-neutral-700">
          <tr>
            {columnNames.map((column) => (
              <th key={column.toString()} className="p-3 sm:p-4">
                <div className={`flex justify-center gap-2`}>
                  <p className="font-bold">{capitalize(column)}</p>
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
          className="bg-neutral-50 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-400 dark:bg-neutral-800"
          ref={tableBodyRef}
        >
          {!objArrayState.length && (
            <tr>
              <td className="p-2 sm:p-4" colSpan={columnNames.length}>
                <div className="flex justify-center gap-2">
                  {`No ${entityName}s yet...`}
                  {newLink && <IconLink title={`New ${entityName}`} href={newLink} Icon={PlusIcon} />}
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
              emitMessage={(message) => toast.error(message)}
              onRowAction={onAction}
            />
          ))}
        </tbody>
        {showCount && objArrayState.length > 0 && (
          <tfoot>
            <tr>
              {newLink && (
                <td>
                  <IconLink title={`New ${entityName}`} label="Add new" href={newLink} Icon={PlusIcon} />
                </td>
              )}
              {columns.length > 2 && <td colSpan={columns.length - (newLink ? 2 : 1)}></td>}
              <td className="text-end">
                {objArrayState.length} {entityName + sOrNoS(objArrayState.length)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default GenericTable;