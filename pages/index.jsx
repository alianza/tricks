import dbConnect from '../lib/dbConnect';
import findAndSerializeDoc, { capitalize, getFullName, getFullTrickName } from '../lib/util';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import { Model } from 'mongoose';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import utilStyles from '../styles/utils.module.scss';
import { useEffect, useState } from 'react';

export async function getServerSideProps() {
  await dbConnect();

  const flatgroundTricks = await findAndSerializeDoc(FlatGroundTrick, Model.find, {});

  const grinds = await findAndSerializeDoc(Grind, Model.find, {});

  return { props: { flatgroundTricks, grinds } };
}

function TableDataRow({ obj, columns, actions, endpoint, emitMessage, deleteRow }) {
  const [objColumnMap, setObjColumnMap] = useState({});

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${getFullName(obj, endpoint)}"?`)) return;

    try {
      const response = await fetch(`/api/${endpoint}/${obj._id}`, { method: 'Delete' });
      if (!response.ok) throw new Error(`Failed to delete ${getFullName(obj, endpoint)}`);
      deleteRow(obj._id);
      emitMessage('');
    } catch (error) {
      emitMessage(`Failed to delete ${getFullName(obj, endpoint)}`);
    }
  };

  useEffect(() => {
    columns.forEach((column) => {
      setObjColumnMap((prevObjColumnMap) => ({ ...prevObjColumnMap, [column]: obj[column] }));
    });
  }, []);

  return (
    <tr className="border-t-2 border-neutral-400">
      {Object.entries(objColumnMap).map(([key, value]) => {
        if (key === 'actions') {
          const actionsOutput = actions.map((action) => {
            switch (action) {
              case 'edit':
                return (
                  <Link href={`/${endpoint}/[_id]/edit`} as={`/${endpoint}/${obj._id}/edit`}>
                    <button className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>
                      Edit
                    </button>
                  </Link>
                );
              case 'view':
                return (
                  <Link href={`/${endpoint}/[_id]`} as={`/${endpoint}/${obj._id}`}>
                    <button className={`${utilStyles.button} bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600`}>
                      View
                    </button>
                  </Link>
                );
              case 'delete':
                return (
                  <div onClick={handleDelete}>
                    <button className={`${utilStyles.button} bg-red-500 focus:ring-red-600/50 hover:bg-red-600`}>
                      Delete
                    </button>
                  </div>
                );
              default:
                return null;
            }
          });

          return (
            <td key={key} className="flex gap-2 p-4">
              {actionsOutput}
            </td>
          );
        }
        return (
          <td key={key} className="p-4">
            {capitalize(value)}
          </td>
        );
      })}
    </tr>
  );
}

function Table({ objArray, columns, actions, endpoint }) {
  const [columnsState] = useState(actions.length ? [...columns, 'actions'] : columns);
  const [objArrayState, setObjArrayState] = useState(objArray);
  const [columnSortDirectionMap, setColumnSortDirectionMap] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    sort(columns[0], 'asc');
  }, []);

  const sort = (column, direction) => {
    const sortedArray = [...objArrayState].sort((a, b) => {
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      return 0;
    });

    setColumnSortDirectionMap({ [column]: direction });
    setObjArrayState(sortedArray);
  };

  const emitMessage = (message) => setMessage(message);

  const deleteRow = (id) => {
    setObjArrayState((prevObjArrayState) => prevObjArrayState.filter((obj) => obj._id !== id));
  };

  return (
    <>
      <table className="table-auto">
        <thead className="bg-neutral-700">
          <tr>
            {columnsState.map((column) => (
              <th key={column.toString()} className="p-4">
                <p className="inline-block">{capitalize(column)}</p>
                {column !== 'actions' && columnSortDirectionMap[column] === 'asc' && (
                  <ChevronDownIcon
                    onClick={() => sort(column, 'desc')}
                    className="ml-2 inline-block h-6 w-6 cursor-pointer"
                  ></ChevronDownIcon>
                )}
                {column !== actions && columnSortDirectionMap[column] === 'desc' && (
                  <ChevronUpIcon
                    onClick={() => sort(column, 'asc')}
                    className="ml-2 inline-block h-6 w-6 cursor-pointer"
                  ></ChevronUpIcon>
                )}
                {column !== 'actions' && !columnSortDirectionMap[column] && (
                  <ChevronUpDownIcon
                    onClick={() => sort(column, 'asc')}
                    className="ml-2 inline-block h-6 w-6 cursor-pointer"
                  ></ChevronUpDownIcon>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-neutral-50 dark:bg-neutral-800">
          {objArrayState.map((obj) => (
            <TableDataRow
              key={obj._id}
              obj={obj}
              columns={columnsState}
              actions={actions}
              endpoint={endpoint}
              emitMessage={emitMessage}
              deleteRow={deleteRow}
            ></TableDataRow>
          ))}
          {/*{!objArrayState.length && <tr className="col-span-10">{`No ${endpoint} yet...`}</tr>}*/}
        </tbody>
      </table>
      {message && <p className="mx-auto my-2 font-bold text-red-500">{message}</p>}
    </>
  );
}

const Index = ({ flatgroundTricks, grinds }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center">
        <h1 className="mb-6 text-4xl">Flatground Tricks</h1>
        <div className="flex flex-col items-center">
          <Table
            objArray={flatgroundTricks}
            columns={['stance', 'direction', 'rotation', 'name']}
            actions={['edit', 'view']}
            endpoint="flatgroundtricks"
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="mb-6 text-4xl">Grinds</h1>
        <div className="flex flex-col">
          <Table
            objArray={grinds}
            columns={['stance', 'direction', 'name']}
            actions={['edit', 'view', 'delete']}
            endpoint="grinds"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
