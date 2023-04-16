import dbConnect from '../lib/dbConnect';
import { getCombos, getTricks } from '../lib/serverUtils';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import { Model } from 'mongoose';
import Table from '../components/common/table/table';
import Combo from '../models/Combo';
import Manual from '../models/Manual';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import LinkWithArrow from '../components/common/LinkWithArrow';

export async function getServerSideProps(context) {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);
  const query = { userId: session.user.id };

  const flatgroundTricks = await getTricks(FlatGroundTrick, Model.find, query);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', 'trick'];
  const flatgroundActions = ['edit', 'view', 'delete'];
  const flatGroundTricksData = { flatgroundTricks, flatgroundColumns, flatgroundActions };

  const grinds = await getTricks(Grind, Model.find, query);
  const grindColumns = ['stance', 'direction', 'name', 'trick'];
  const grindActions = ['edit', 'view', 'delete'];
  const grindsData = { grinds, grindColumns, grindActions };

  const manuals = await getTricks(Manual, Model.find, query);
  const [manualActions, manualColumns] = [['edit', 'view', 'delete'], ['type']];
  const manualsData = { manuals, manualColumns, manualActions };

  let combos = await getCombos(Combo, Model.find, query);
  const [comboColumns, comboActions] = [['combo'], ['edit', 'view', 'delete']];
  const combosData = { combos, comboColumns, comboActions };

  return {
    props: {
      flatgroundTricks: { ...flatGroundTricksData },
      grinds: { ...grindsData },
      combos: { ...combosData },
      manuals: { ...manualsData },
    },
  };
}

const Index = ({ flatgroundTricks, grinds, combos, manuals }) => {
  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Dashboard</h1>
        <p className="mt-3 text-center">This is a overview of all the tricks you've added to your account.</p>
      </div>
      <div className="flex flex-col">
        <LinkWithArrow label="Flatground Tricks" href="/flatgroundtricks" />
        <Table
          objArray={flatgroundTricks.flatgroundTricks}
          columns={flatgroundTricks.flatgroundColumns}
          actions={flatgroundTricks.flatgroundActions}
          endpoint="flatgroundtricks"
          newLink="/new-flatground-trick"
          showCount
        />
      </div>

      <div className="flex flex-col">
        <LinkWithArrow label="Grinds" href="/grinds" />
        <Table
          objArray={grinds.grinds}
          columns={grinds.grindColumns}
          actions={grinds.grindActions}
          endpoint="grinds"
          newLink="/new-grind"
          showCount
        />
      </div>

      <div className="flex flex-col">
        <LinkWithArrow label="Manuals" href="/manuals" />
        <Table
          objArray={manuals.manuals}
          columns={manuals.manualColumns}
          actions={manuals.manualActions}
          endpoint="manuals"
          newLink={'/new-manual'}
          showCount
        />
      </div>

      <div className="flex flex-col">
        <LinkWithArrow label="Combos" href="/combos" />
        <Table
          objArray={combos.combos}
          columns={combos.comboColumns}
          actions={combos.comboActions}
          endpoint="combos"
          newLink="/new-combo"
          updateLocalState
          showCount
        />
      </div>
    </div>
  );
};

export default Index;
