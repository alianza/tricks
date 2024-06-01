import { capitalize, deepGet, formatDate, isString, omit } from '../../../lib/commonUtils';
import { cloneElement } from 'react';
import Show from '../Show';

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

  return (
    <tr className="after:absolute after:left-0 after:h-[2px] after:w-full after:bg-neutral-400">
      {Object.entries(objColumnMap).map(([colName, { value, colProps }]) => (
        <Show
          if={colName === 'actions'}
          show={() => (
            <td key={colName} className="p-0 md:p-2">
              <div className="-mb-[2px] flex flex-col justify-center border-2 border-neutral-400 md:flex-row md:gap-2 md:border-none">
                {formatActions(colName, value)}
              </div>
            </td>
          )}
          else={() => (
            <td key={colName} className="px-2 py-3">
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
