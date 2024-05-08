import { capitalize, deepGet, formatDate, isString, omit } from '../../../lib/commonUtils';
import { cloneElement } from 'react';

const colPropsToOmit = ['key', 'alias', 'capitalize', 'onClick', 'formatDate'];

function GenericTableDataRow({ obj, columns, actions, onRowAction, noValuePlaceHolder }) {
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
    if (value === undefined) return noValuePlaceHolder;
    let formattedValue = value.toString();
    if (colProps?.formatDate) return formatDate(value);
    if (colProps?.capitalize !== false) return capitalize(value);
    return formattedValue;
  };

  return (
    <tr className="relative after:absolute after:left-0 after:h-[2px] after:w-full after:bg-neutral-400">
      {Object.entries(objColumnMap).map(([colName, colData]) => {
        const { value, colProps } = colData;
        return colName === 'actions' ? (
          <td key={colName} className="px-2 py-3 sm:px-3 sm:py-4">
            <div className="flex justify-center gap-2">{formatActions(colName, value)}</div>
          </td>
        ) : (
          <td key={colName} className="px-2 py-3 sm:px-3 sm:py-4">
            <span
              {...omit(colProps, colPropsToOmit)}
              {...(colProps?.onClick && { onClick: () => colProps?.onClick(obj) })}
            >
              {formatColumnValue(colProps, value)}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

export default GenericTableDataRow;
