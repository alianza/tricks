import { useEffect, useRef, useState } from 'react';
import { capitalize, isString, sOrNoS } from '../../../lib/commonUtils';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/20/solid';
import GenericTableDataRow from './GenericTableDataRow';
import IconLink from '../IconLink';
import Loader from '../Loader';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Show from '../Show';
import Link from 'next/link';
import { useRouter } from 'next/router';

const duration = 250; // default auto-animate duration

const chevronClassName = 'size-6 shrink-0 cursor-pointer';

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
 *     @param [options.showCountPrefix=''] {String} - Prefix to display before count
 *     @param [options.newLink] {String} - Link to create new entity
 *     @param [options.actionsColumnName=] {String} - Custom name for the actions column
 *     @param [options.sorting=true] {Boolean} - Opt out of sorting
 *     @param [options.defaultSortColumnIndex=0] {Number} - Index of column to initially sort by
 *     @param [options.defaultSortDirection='asc'] {('asc'|'desc')} - Direction to initially sort by. Default is 'asc'.
 *     @param [options.headerColumnClassNames=''] {String} - Class names to apply to header columns
 *     @param [options.headerColumnStyles={}] {Object} - Styles to apply to header columns
 *     @param [options.noValuePlaceHolder='-'] {String} - Placeholder to display when value is undefined
 *     @param [options.additionalInfo=''] {String} - Additional info to display at the bottom of the table
 *     @param [options.additionalInfoLink=''] {String} - Link to additional info
 *     @param [options.itemsPerPage=10] {Number} - Number of items to display per page
 *     @param [options.enablePagination=false] {Boolean} - Whether to enable pagination
 *     @param [options.flipCollapsedActionsFromRowToLast=2] {Number} - Position from last row to flip collapsed actions to above actions button instead of below (to prevent overflow)
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
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef(null);
  const [maxPaginationWidth, setMaxPaginationWidth] = useState(tableRef.current?.clientWidth);
  const router = useRouter();

  const {
    showCount = false,
    showCountPrefix = '',
    newLink,
    actionsColumnName,
    sorting = true,
    className = '',
    defaultSortDirection = 'asc',
    defaultSortColumnIndex = 0,
    headerColumnClassNames = '',
    headerColumnStyles = {},
    noValuePlaceHolder = '-',
    additionalInfo = '',
    additionalInfoLink = '',
    itemsPerPage = 10,
    enablePagination = false,
    flipCollapsedActionsFromRowToLast = 2,
  } = options;

  const totalPages = Math.ceil(objArrayState.length / itemsPerPage);

  if (actions?.length) columns = [...columns, 'actions'];

  useEffect(() => {
    sort(getColumnProp(columns[defaultSortColumnIndex]), defaultSortDirection); // Default ascending sort on first column

    const handleRouteChange = (url) => {
      const regex = /page=(\d+)/; // page=1
      const page = parseInt(url.split('?')[1]?.match(regex)?.[1]);
      if (page) deAnimate(() => setCurrentPage(page));
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  useEffect(() => {
    if (router.query.page) setCurrentPage(parseInt(router.query.page));
  }, [router.query]);

  useEffect(() => {
    setMaxPaginationWidth(tableRef.current?.clientWidth);

    if (enablePagination && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      router.push({ query: { ...router.query, page: totalPages } }); // Update url params if page is out of bounds
    }
  }, [currentPage, objArrayState]);

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

  const paginate = (data, pageNumber, pageSize) => data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  const handlePrevious = () =>
    deAnimate(async () => {
      const page = Math.max(currentPage - 1, 1);
      setCurrentPage(page);
      await router.push({ query: { ...router.query, page } });
    });

  const handleNext = () =>
    deAnimate(async () => {
      const page = Math.min(currentPage + 1, totalPages);
      setCurrentPage(page);
      await router.push({ query: { ...router.query, page } });
    });

  const hasItems = !!objArrayState.length;

  const paginatedData = enablePagination ? paginate(objArrayState, currentPage, itemsPerPage) : objArrayState;

  return (
    <div className={`${className} react-generic-table flex flex-col gap-2`}>
      <div className="flex flex-col items-center overflow-y-hidden drop-shadow">
        <table ref={tableRef} className="relative mx-auto table-auto text-neutral-900 dark:text-neutral-100">
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
                      <Show if={sorting && !loading && hasItems}>
                        <Show if={columnSortDirection[colProp] === 'asc'}>
                          <ChevronDownIcon className={chevronClassName} onClick={() => sort(colProp, 'desc')} />
                        </Show>
                        <Show if={columnSortDirection[colProp] === 'desc'}>
                          <ChevronUpIcon className={chevronClassName} onClick={() => sort(colProp, 'asc')} />
                        </Show>
                        <Show if={!isActionsColumn && !columnSortDirection[colProp]}>
                          <ChevronUpDownIcon className={chevronClassName} onClick={() => sort(colProp, 'asc')} />
                        </Show>
                      </Show>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="border-b-2 border-neutral-400 bg-neutral-50 dark:bg-neutral-800" ref={tableBody}>
            <Show if={!hasItems}>
              <tr>
                <td className="p-2 sm:p-4" colSpan={columns.length}>
                  <div className="flex justify-center gap-2">
                    {loading ? <Loader className="mx-auto my-24" /> : `No ${entityName}s found.`}
                    {newLink && !loading && <IconLink title={`New ${entityName}`} href={newLink} Icon={PlusIcon} />}
                  </div>
                </td>
              </tr>
            </Show>
            {paginatedData.map((obj, index) => (
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

          <Show if={showCount || newLink}>
            <tfoot>
              <tr>
                <Show if={newLink}>
                  <td className="flex" colSpan={!showCount ? columns.length : 1}>
                    <IconLink title={`New ${entityName}`} label="Add new" href={newLink} Icon={PlusIcon} />
                  </td>
                </Show>
                <Show if={showCount}>
                  <td colSpan={newLink ? columns.length - 1 : columns.length}>
                    <div className="flex flex-col items-end">
                      <span>
                        {objArrayState.length} {showCountPrefix} {capitalize(entityName) + sOrNoS(objArrayState.length)}
                      </span>

                      <Show if={additionalInfo}>
                        {additionalInfoLink ? (
                          <Link href={additionalInfoLink} className="underline-hover text-sm">
                            {additionalInfo}
                          </Link>
                        ) : (
                          <span className="block text-sm">{additionalInfo}</span>
                        )}
                      </Show>
                    </div>
                  </td>
                </Show>
              </tr>
            </tfoot>
          </Show>
        </table>
      </div>

      <Show if={enablePagination && objArrayState.length > itemsPerPage}>
        <div className="mx-auto flex w-full justify-between" style={{ maxWidth: maxPaginationWidth }}>
          <button
            onClick={handlePrevious}
            className="underline-hover font-semibold disabled:invisible"
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <span>
            Page {currentPage}/{totalPages}
          </span>
          <button
            className="underline-hover font-semibold disabled:invisible"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      </Show>
    </div>
  );
}

export default GenericTable;
