import dbConnect from '../lib/dbConnect';
import findAndSerializeDoc, { getTricks, populateCombosTricksNames } from '../lib/util';
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

  let combos = await findAndSerializeDoc({ model: Combo, operation: Model.find, populateFields: ['trickArray.trick'] });
  combos = populateCombosTricksNames(combos);

  // only keep trick field with trick name and _id of each combo
  combos = combos.map(({ _id, trickArray }) => {
    const trickNameTypeMap = trickArray.map(({ trick, trickRef }) => ({ trick, trickRef }));

    const comboNameArray = trickNameTypeMap.map(({ trick, trickRef }, index) => {
      // if next trick is the last trick, and it's a flatground trick
      if (index === trickNameTypeMap.length - 2 && trickNameTypeMap[index + 1].trickRef === FlatGroundTrick.modelName) {
        return `${trick}`;
      }
      // last trick
      if (index === trickNameTypeMap.length - 1) {
        return trickRef === FlatGroundTrick.modelName ? `${trick} out` : `${trick}`;
      }
      return `${trick} to`;
    });
    return { _id: _id, trick: comboNameArray.join(' ') };
  });
  const comboColumns = ['trick'];
  const comboActions = ['edit', 'view', 'delete'];

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
    <div className="flex flex-col gap-16">
      <div className="flex flex-col">
        <h1 className="mx-auto mb-6 text-4xl">Flatground Tricks</h1>
        <Table
          objArray={flatgroundTricks}
          columns={flatgroundColumns}
          actions={flatgroundActions}
          endpoint="flatgroundtricks"
        />
      </div>

      <div className="flex flex-col">
        <h1 className="mx-auto mb-6 text-4xl">Grinds</h1>
        <Table objArray={grinds} columns={grindColumns} actions={grindActions} endpoint="grinds" />
      </div>

      <div className="flex flex-col">
        <h1 className="mx-auto mb-6 text-4xl">Combos</h1>
        <Table
          objArray={combos}
          columns={comboColumns}
          actions={comboActions}
          endpoint="combos"
          // comboTable
        />
      </div>
    </div>
  );
};

export default Index;
