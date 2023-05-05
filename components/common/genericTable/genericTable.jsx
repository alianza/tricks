import { useEffect, useRef, useState } from 'react';
import { capitalize, sOrNoS } from '../../../lib/commonUtils';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/20/solid';
import TableDataRow from './genericTableDataRow';
import autoAnimate from '@formkit/auto-animate';
import IconLink from '../IconLink';

const GenericTable = ({ objArray, columns, actions, entityName, onAction, showCount = false, newLink }) => {
  const [columnSortDirection, setColumnSortDirection] = useState({});
  const [objArrayState, setObjArrayState] = useState(objArray);
  const [animating, setAnimating] = useState(false);
  const tableBodyRef = useRef(null);

  if (actions.length) {
    columns = [...columns, 'actions'];
  }

  useEffect(() => {
    sort(columns[0], 'asc'); // Default ascending sort on first column
  }, []);

  useEffect(() => {
    setTimeout(() => tableBodyRef.current && autoAnimate(tableBodyRef.current), 1);
  }, [objArrayState]);

  useEffect(() => {
    setObjArrayState(objArray);
  }, [objArray]);

  const sort = (column, direction) => {
    setAnimating(true);
    setObjArrayState((prevObjArrayState) =>
      prevObjArrayState.sort((a, b) => {
        if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
        if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
        return 0;
      })
    );
    setColumnSortDirection({ [column]: direction });
    setTimeout(() => setAnimating(false), 250); // default auto-animate duration
  };

  return (
    <div
      className={`flex flex-col items-center overflow-y-hidden ${animating ? 'overflow-x-hidden' : 'overflow-x-auto'}`}
    >
      <table className="relative mx-auto table-auto">
        <thead className="bg-neutral-200 dark:bg-neutral-700">
          <tr>
            {columns.map((col) => {
              const colName = typeof col === 'string' ? col : Object.values(col)[0].alias || Object.keys(col)[0];
              const colProp = typeof col === 'string' ? col : Object.keys(col)[0];

              return (
                <th key={colName} className="p-3 sm:p-4">
                  <div className={`flex justify-center gap-2`}>
                    <p className="font-bold">{capitalize(colName)}</p>
                    {columnSortDirection[colProp] === 'asc' && (
                      <ChevronDownIcon onClick={() => sort(colProp, 'desc')} className="h-6 w-6 cursor-pointer" />
                    )}
                    {columnSortDirection[colProp] === 'desc' && (
                      <ChevronUpIcon onClick={() => sort(colProp, 'asc')} className="h-6 w-6 cursor-pointer" />
                    )}
                    {colName !== 'actions' && !columnSortDirection[colProp] && (
                      <ChevronUpDownIcon onClick={() => sort(colProp, 'asc')} className="h-6 w-6 cursor-pointer" />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody
          className="bg-neutral-50 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-400 dark:bg-neutral-800"
          ref={tableBodyRef}
        >
          {!objArrayState.length && (
            <tr>
              <td className="p-2 sm:p-4" colSpan={columns.length}>
                <div className="flex justify-center gap-2">
                  {`No ${entityName}s yet...`}
                  {newLink && <IconLink title={`New ${entityName}`} href={newLink} Icon={PlusIcon} />}
                </div>
              </td>
            </tr>
          )}
          {objArrayState.map((obj) => (
            <TableDataRow key={obj._id} obj={obj} columns={columns} actions={actions} onRowAction={onAction} />
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
