import { capitalize, deepGet, isString, omit } from '../../../lib/commonUtils';
import { cloneElement } from 'react';

const colPropsToOmit = ['className', 'key', 'alias', 'capitalize'];

const genericTableDataRow = ({ obj, columns, actions, onRowAction }) => {
  const objColumnMap = {};

  columns.forEach((col) => {
    const [[colName, colProps]] = isString(col) ? [[col]] : Object.entries(col);
    if (colName === 'actions') {
      objColumnMap[colName] = { colProps, value: actions }; // Value of actions column are the actions itself
    } else {
      objColumnMap[colName] = { colProps, value: deepGet(obj, colName) };
    }
  });

  return (
    <tr className="relative after:absolute after:left-0 after:h-[2px] after:w-full after:bg-neutral-400">
      {Object.entries(objColumnMap).map(([colName, colData]) => {
        const { value, colProps } = colData;
        if (colName === 'actions') {
          return (
            <td key={colName} className="p-3 sm:p-4">
              <div className="flex justify-center gap-2">
                {value.map((actionObj) => {
                  const [[action, elementFunc]] = Object.entries(actionObj);
                  if (typeof elementFunc !== 'function') {
                    console.warn(`No element function provided for action ${actionObj}`);
                    return null;
                  }
                  return cloneElement(elementFunc(obj), { onClick: () => onRowAction(action, obj), key: action });
                })}
              </div>
            </td>
          );
        }

        return (
          <td key={colName} className={`p-3 sm:p-4 ${colProps?.className}`} {...omit(colProps, colPropsToOmit)}>
            {colProps?.capitalize ?? true ? capitalize(value) : value.toString()}
          </td>
        );
      })}
    </tr>
  );
};

export default genericTableDataRow;
