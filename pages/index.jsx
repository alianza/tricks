import dbConnect from '../lib/dbConnect';
import findAndSerializeDoc, { getFullComboName, getTricks, populateComboTrickName } from '../lib/util';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import { Model } from 'mongoose';
import Table from '../components/common/table/table';
import Combo from '../models/Combo';
import Manual from '../models/Manual';
import { signIn, useSession } from 'next-auth/react';
import utilStyles from '../styles/utils.module.scss';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);

  console.log(`serverside session`, session);

  const flatgroundTricks = await getTricks(FlatGroundTrick, Model.find);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', 'trick'];
  const flatgroundActions = ['edit', 'view', 'delete'];

  const grinds = await getTricks(Grind, Model.find);
  const grindColumns = ['stance', 'direction', 'name', 'trick'];
  const grindActions = ['edit', 'view', 'delete'];

  const manuals = await findAndSerializeDoc({ model: Manual, operation: Model.find });
  const manualColumns = ['type'];
  const manualActions = ['edit', 'view', 'delete'];

  let combos = await findAndSerializeDoc({ model: Combo, operation: Model.find, populateFields: ['trickArray.trick'] });
  combos = combos.map(populateComboTrickName);
  combos = combos.map(({ _id, trickArray }) => ({ _id, combo: getFullComboName({ trickArray }) }));
  const comboColumns = ['combo'];
  const comboActions = ['edit', 'view', 'delete'];

  return {
    props: {
      flatgroundTricks: {
        flatgroundTricks,
        flatgroundColumns,
        flatgroundActions,
      },
      grinds: {
        grinds,
        grindColumns,
        grindActions,
      },
      combos: {
        combos,
        comboColumns,
        comboActions,
      },
      manuals: {
        manuals,
        manualColumns,
        manualActions,
      },
    },
  };
}

const Index = ({ flatgroundTricks, grinds, combos, manuals }) => {
  const { data: session } = useSession();

  console.log(`session client`, session);

  return (
    <>
      {session ? (
        <div className="flex flex-col gap-16">
          <div className="flex flex-col">
            <h1 className="mx-auto mb-6 text-4xl">Flatground Tricks</h1>
            <Table
              objArray={flatgroundTricks.flatgroundTricks}
              columns={flatgroundTricks.flatgroundColumns}
              actions={flatgroundTricks.flatgroundActions}
              endpoint="flatgroundtricks"
              showCount
            />
          </div>

          <div className="flex flex-col">
            <h1 className="mx-auto mb-6 text-4xl">Grinds</h1>
            <Table
              objArray={grinds.grinds}
              columns={grinds.grindColumns}
              actions={grinds.grindActions}
              endpoint="grinds"
              showCount
              // grindTable
            />
          </div>

          <div className="flex flex-col">
            <h1 className="mx-auto mb-6 text-4xl">Manuals</h1>
            <Table
              objArray={manuals.manuals}
              columns={manuals.manualColumns}
              actions={manuals.manualActions}
              endpoint="manuals"
              showCount
            />
          </div>

          <div className="flex flex-col">
            <h1 className="mx-auto mb-6 text-4xl">Combos</h1>
            <Table
              objArray={combos.combos}
              columns={combos.comboColumns}
              actions={combos.comboActions}
              endpoint="combos"
              updateLocalState
              showCount
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full h-full flex-col items-center justify-center">
          <h1 className="text-4xl">You must be signed in to view this page</h1>
          <button className={`${utilStyles.button} ${utilStyles.green}`} onClick={() => signIn()}>
            Sign in
          </button>
        </div>
      )}
    </>
  );
};

export default Index;
