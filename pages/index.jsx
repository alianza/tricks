import dbConnect from '../lib/dbConnect';
import findAndSerializeDoc, { getTricks } from '../lib/util';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import { Model } from 'mongoose';
import Table from '../components/common/table/table';
import Combo from '../models/Combo';

export async function getServerSideProps() {
  await dbConnect();

  const flatgroundTricks = await getTricks(FlatGroundTrick, Model.find);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', 'trick'];
  const flatgroundActions = ['edit', 'view', 'delete'];

  const grinds = await getTricks(Grind, Model.find);
  const grindColumns = ['stance', 'direction', 'name', 'trick'];
  const grindActions = ['edit', 'view', 'delete'];

  let combos = await findAndSerializeDoc(Combo, Model.find);
  const comboColumns = ['trickArray'];
  const comboActions = ['edit', 'view', 'delete'];

  console.log(`combos`, combos);

  return {
    props: {
      flatgroundTricks,
      flatgroundColumns,
      flatgroundActions,
      grinds,
      grindColumns,
      grindActions,
      combos,
      comboColumns,
      comboActions,
    },
  };
}

const Index = ({
  flatgroundTricks,
  flatgroundColumns,
  flatgroundActions,
  grinds,
  grindColumns,
  grindActions,
  combos,
  comboColumns,
  comboActions,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <h1 className="mx-auto mb-6 text-4xl">Flatground Tricks</h1>
        <div className="overflow-x-auto">
          <Table
            objArray={flatgroundTricks}
            columns={flatgroundColumns}
            actions={flatgroundActions}
            endpoint="flatgroundtricks"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="mx-auto mb-6 text-4xl">Grinds</h1>
        <div className="overflow-x-auto">
          <Table objArray={grinds} columns={grindColumns} actions={grindActions} endpoint="grinds" />
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="mx-auto mb-6 text-4xl">Combos</h1>
        <div className="overflow-x-auto">
          <Table objArray={combos} columns={comboColumns} actions={comboActions} endpoint="combos" />
        </div>
      </div>
    </div>
  );
};

export default Index;
