import { useEffect, useState } from 'react';
import { capitalize, isString, sOrNoS } from '../../../lib/commonUtils';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/20/solid';
import GenericTableDataRow from './GenericTableDataRow';
import IconLink from '../IconLink';
import Loader from '../loader';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const duration = 250; // default auto-animate duration

const chevronClassName = 'h-6 w-6 shrink-0 cursor-pointer';

/**
 * Generic table component
 * @param objArray {Array} - Array of objects to display in table
 * @param columns {Array} - Array of column names or objects with key as column name and options as value
 *    @param [columns.alias] {String} - Alias to display in table header
 *    @param [columns.className] {String} - Class name to apply to column
 *    @param [columns.formatDate=false] {Boolean} - Whether to format date (if value is a date)
 *    @param [columns.capitalize=true] {Boolean} - Whether to capitalize value
 *    @param [columns.alignHeader] {('start'|'center'|'end')} - Alignment of column header
 * @param actions {Array} - Array of action objects with key as action name and value as element function
 * @param [entityName='item'] {String} - Name of entity to display in table
 * @param onAction {Function} - Callback function to handle actions
 * @param [options] {Object} - Options object
 *     @param [options.showCount=false] {Boolean} - Whether to show count of objects in table
 *     @param [options.newLink] {String} - Link to create new entity
 *     @param [options.actionsColumnName=] {String} - Custom name for the actions column
 *     @param [options.sorting=true] {Boolean} - Opt out of sorting
 *     @param [options.defaultSortColumnIndex=0] {Number} - Index of column to initially sort by
 *     @param [options.defaultSortDirection='asc'] {('asc'|'desc')} - Direction to initially sort by. Default is 'asc'.
 *     @param [options.headerColumnClassNames=''] {String} - Class names to apply to header columns
 *     @param [options.headerColumnStyles={}] {Object} - Styles to apply to header columns
 *     @param [options.noValuePlaceHolder='-'] {String} - Placeholder to display when value is undefined
 * @returns {JSX.Element} - Generic table component
 * @constructor - GenericTable
 */

function GenericTable({
  objArray = null,
  columns = [],
  actions,
  entityName = 'item',
  onAction = () => {},
  ...options
}) {
  const [columnSortDirection, setColumnSortDirection] = useState({ [columns[0]]: 'asc' });
  const [loading, setLoading] = useState(objArray === null);
  const [objArrayState, setObjArrayState] = useState(objArray || []);
  const [tableBody, enableAnimations] = useAutoAnimate();

  const {
    showCount = false,
    newLink,
    actionsColumnName,
    sorting = true,
    className = '',
    defaultSortDirection = 'asc',
    defaultSortColumnIndex = 0,
    headerColumnClassNames = '',
    headerColumnStyles = {},
    noValuePlaceHolder = '-',
  } = options;

  if (actions?.length) columns = [...columns, 'actions'];

  useEffect(() => {
    sort(getColumnProp(columns[defaultSortColumnIndex]), defaultSortDirection); // Default ascending sort on first column
  }, []);

  useEffect(() => {
    const operations = () => {
      setObjArrayState(objArray || []);
      setLoading(objArray === null);
      const [[column, direction]] = Object.entries(columnSortDirection);
      if (objArray) sort(column, direction); // Sort again if objArray changes
    };

    if (objArrayState?.length === 0 && objArray?.length > 0) {
      deAnimate(operations); // if array was empty before
    } else {
      objArrayState?.length > objArray?.length ? deAnimate(operations) : operations(); // Disable animations if an item was removed
    }
  }, [objArray]);

  const sort = (column, direction) => {
    setObjArrayState((prevObjArrayState) =>
      prevObjArrayState.sort((a, b) => {
        const normalize = (value) => (isString(value) ? value.toUpperCase() : value || '');
        if (normalize(a[column]) > normalize(b[column])) return direction === 'asc' ? 1 : -1;
        if (normalize(a[column]) < normalize(b[column])) return direction === 'asc' ? -1 : 1;
        return 0;
      }),
    );
    setColumnSortDirection({ [column]: direction });
  };

  const deAnimate = (fn) => {
    enableAnimations(false);
    fn();
    setTimeout(() => enableAnimations(true), duration);
  };

  const getColumnProp = (col) => (isString(col) ? col : Object.keys(col)[0]);

  const hasItems = !!objArrayState.length;

  return (
    <div className={`${className} react-generic-table flex flex-col items-center overflow-y-hidden drop-shadow`}>
      <table className="relative mx-auto table-auto text-neutral-900 dark:text-neutral-100">
        <thead className="bg-neutral-200 dark:bg-neutral-700">
          <tr>
            {columns.map((col) => {
              let isActionsColumn = false;
              let colName = isString(col) ? col : Object.values(col)[0].alias || Object.keys(col)[0];
              const colProp = getColumnProp(col);
              if (colName === 'actions') {
                colName = actionsColumnName || colName;
                isActionsColumn = true;
              }

              return (
                <th key={colName} className="px-2 py-3 sm:px-3 sm:py-4">
                  <div
                    className={`flex flex-nowrap items-center gap-1 text-sm sm:gap-2 sm:text-base ${isActionsColumn ? 'justify-center' : ''}`}
                  >
                    <p className={`font-bold ${headerColumnClassNames}`} style={headerColumnStyles}>
                      {capitalize(colName)}
                    </p>
                    {sorting && !loading && hasItems && (
                      <>
                        {columnSortDirection[colProp] === 'asc' && (
                          <ChevronDownIcon className={chevronClassName} onClick={() => sort(colProp, 'desc')} />
                        )}
                        {columnSortDirection[colProp] === 'desc' && (
                          <ChevronUpIcon className={chevronClassName} onClick={() => sort(colProp, 'asc')} />
                        )}
                        {!isActionsColumn && !columnSortDirection[colProp] && (
                          <ChevronUpDownIcon className={chevronClassName} onClick={() => sort(colProp, 'asc')} />
                        )}
                      </>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody
          className="bg-neutral-50 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-400 dark:bg-neutral-800"
          ref={tableBody}
        >
          {!hasItems && (
            <tr>
              <td className="p-2 sm:p-4" colSpan={columns.length}>
                <div className="flex justify-center gap-2">
                  {loading ? <Loader className="mx-auto my-24" /> : `No ${entityName}s found.`}
                  {newLink && !loading && <IconLink title={`New ${entityName}`} href={newLink} Icon={PlusIcon} />}
                </div>
              </td>
            </tr>
          )}
          {objArrayState.map((obj) => (
            <GenericTableDataRow
              key={obj._id}
              obj={obj}
              columns={columns}
              actions={actions}
              onRowAction={(...params) => onAction(...params, entityName)}
              noValuePlaceHolder={noValuePlaceHolder}
            />
          ))}
        </tbody>
        {(showCount || newLink) && (
          <tfoot>
            <tr>
              {newLink && (
                <td colSpan={!showCount ? columns.length : 1}>
                  <IconLink title={`New ${entityName}`} label="Add new" href={newLink} Icon={PlusIcon} />
                </td>
              )}
              {showCount && (
                <>
                  {columns.length > 2 && <td colSpan={columns.length - (newLink ? 2 : 1)} />}
                  <td className="text-end">
                    {objArrayState.length} {capitalize(entityName) + sOrNoS(objArrayState.length)}
                  </td>
                </>
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default GenericTable;
