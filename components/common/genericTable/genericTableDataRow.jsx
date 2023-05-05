import { capitalize, omit } from '../../../lib/commonUtils';
import { cloneElement } from 'react';

const genericTableDataRow = ({ obj, columns, actions, onRowAction }) => {
  const objColumnMap = {};

  columns.forEach((columnObj) => {
    const [[columnName, columnProps]] = typeof columnObj === 'string' ? [[columnObj]] : Object.entries(columnObj);
    if (columnName === 'actions') {
      objColumnMap[columnName] = { columnProps, value: actions };
    } else {
      objColumnMap[columnName] = { columnProps, value: obj[columnName] };
    }
  });

  return (
    <tr className="relative after:absolute after:left-0 after:h-[2px] after:w-full after:bg-neutral-400">
      {Object.entries(objColumnMap).map(([columnName, columnData]) => {
        const { value, columnProps } = columnData;
        if (columnName === 'actions') {
          return (
            <td key={columnName} className="p-3 sm:p-4">
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
          <td key={columnName} className={`p-3 sm:p-4 ${columnProps?.className}`} {...omit(columnProps, ['className'])}>
            {capitalize(value)}
          </td>
        );
      })}
    </tr>
  );
};

export default genericTableDataRow;
