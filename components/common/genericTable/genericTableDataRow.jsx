import { capitalize, omit } from '../../../lib/commonUtils';
import { cloneElement } from 'react';

const genericTableDataRow = ({ obj, columns, actions, onRowAction }) => {
  const objColumnMap = {};

  columns.forEach((colObj) => {
    const [[colName, colProps]] = typeof colObj === 'string' ? [[colObj]] : Object.entries(colObj);
    if (colName === 'actions') {
      objColumnMap[colName] = { colProps, value: actions }; // Value of actions column are the actions itself
    } else {
      objColumnMap[colName] = { colProps, value: obj[colProps?.property || colName] };
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
                  return cloneElement(elementFunc(obj), { onClick: () => onRowAction(action, obj), key: action });
                })}
              </div>
            </td>
          );
        }

        return (
          <td key={colName} className={`p-3 sm:p-4 ${colProps?.className}`} {...omit(colProps, ['className', 'key'])}>
            {capitalize(value)}
          </td>
        );
      })}
    </tr>
  );
};

export default genericTableDataRow;
