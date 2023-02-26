import dbConnect from '../lib/dbConnect';
import { getTricks } from '../lib/util';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import { Model } from 'mongoose';
import Table from '../components/common/table';

export async function getServerSideProps() {
  await dbConnect();

  const flatgroundTricks = await getTricks(FlatGroundTrick, Model.find);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', 'trick'];
  const flatgroundActions = ['edit', 'view', 'delete'];

  const grinds = await getTricks(Grind, Model.find);
  const grindColumns = ['stance', 'direction', 'name', 'trick'];
  const grindActions = ['edit', 'view', 'delete'];

  return {
    props: { flatgroundTricks, flatgroundColumns, flatgroundActions, grinds, grindColumns, grindActions },
  };
}

const Index = ({ flatgroundTricks, flatgroundColumns, flatgroundActions, grinds, grindColumns, grindActions }) => {
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
    </div>
  );
};

export default Index;
