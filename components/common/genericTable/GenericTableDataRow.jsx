import { capitalize, deepGet, formatDate, isString, omit } from '../../../lib/commonUtils';
import { cloneElement } from 'react';
import Show from '../Show';
import { Bars2Icon, Bars4Icon, Bars3Icon } from '@heroicons/react/24/solid';

const colPropsToOmit = ['key', 'alias', 'capitalize', 'onClick', 'formatDate'];

function GenericTableDataRow({
  obj,
  columns,
  actions,
  onRowAction,
  noValuePlaceHolder,
  index = 0,
  dataLength = 0,
  flipActionsFromToLast = 2,
}) {
  const objColumnMap = {};

  columns.forEach((col) => {
    const [[colName, colProps]] = isString(col) ? [[col]] : Object.entries(col);
    if (colName === 'actions') {
      objColumnMap[colName] = { colProps, value: actions }; // Value of actions column are the actions itself
    } else {
      objColumnMap[colName] = { colProps, value: deepGet(obj, colName) };
    }
  });

  const formatActions = (name, value) =>
    value.map((actionObj) => {
      const [[action, elementFunc]] = Object.entries(actionObj);
      if (typeof elementFunc !== 'function') {
        console.warn(`No element function provided for action ${actionObj}`);
        return null;
      }
      return cloneElement(elementFunc(obj), {
        onClick: elementFunc(obj).props.onClick
          ? () => {
              elementFunc(obj).props.onClick();
              onRowAction(action, obj);
            }
          : () => onRowAction(action, obj),
        key: action,
      });
    });

  const formatColumnValue = (colProps, value) => {
    if (value === undefined || value === null) return noValuePlaceHolder;
    let formattedValue = value.toString();
    if (colProps?.formatDate) return formatDate(value);
    if (colProps?.capitalize !== false) return capitalize(value);
    return formattedValue;
  };

  const BarsIcon = actions.length < 3 ? Bars2Icon : actions.length === 3 ? Bars3Icon : Bars4Icon;

  return (
    <tr className="relative after:absolute after:left-0 after:h-[2px] after:w-full after:bg-neutral-400">
      {Object.entries(objColumnMap).map(([colName, { value, colProps }]) => (
        <Show
          if={colName === 'actions'}
          show={() => (
            <td key={colName} className="sm:px-3 sm:py-4">
              <div className="hidden justify-center gap-2 md:flex">{formatActions(colName, value)}</div>
              <div className="flex justify-center md:hidden">
                <div class="group relative">
                  <button className="h-full cursor-pointer p-1">
                    <BarsIcon className="size-8 transition-opacity group-hover:opacity-65 touch:group-focus-within:opacity-65" />
                  </button>
                  <div
                    class={`${index >= dataLength - flipActionsFromToLast ? 'bottom-full' : ''} hover-focus-transition group-hover:hover-focus-visible touch:group-focus-within:hover-focus-visible invisible absolute right-0 z-20 flex scale-y-0 flex-col gap-2 bg-neutral-50 p-2 opacity-0 shadow-lg dark:bg-neutral-700`}
                  >
                    {formatActions(colName, value)}
                  </div>
                </div>
              </div>
            </td>
          )}
          else={() => (
            <td key={colName} className="px-2 py-3 sm:px-3 sm:py-4">
              <span
                {...omit(colProps, colPropsToOmit)}
                {...(colProps?.onClick && { onClick: () => colProps?.onClick(obj) })}
              >
                {formatColumnValue(colProps, value)}
              </span>
            </td>
          )}
        />
      ))}
    </tr>
  );
}

export default GenericTableDataRow;
