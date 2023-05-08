import dbConnect from '../lib/dbConnect';
import { getCombos, getTricks } from '../lib/serverUtils';
import { Model } from 'mongoose';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import Combo from '../models/Combo';
import Manual from '../models/Manual';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import LinkWithArrow from '../components/common/LinkWithArrow';
import GenericTable from '../components/common/genericTable/genericTable';
import { trickCol } from '../lib/commonUtils';
import { apiCall, getCommonActions } from '../lib/clientUtils';
import { toast } from 'react-toastify';
import { useState } from 'react';

export async function getServerSideProps(context) {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);
  const query = { userId: session.user.id };

  const flatgroundTricks = await getTricks(FlatGroundTrick, Model.find, query);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', trickCol];

  const grinds = await getTricks(Grind, Model.find, query);
  const grindColumns = ['stance', 'direction', 'name', trickCol];

  const manuals = await getTricks(Manual, Model.find, query);
  const manualColumns = [{ type: { className: 'text-sm font-bold' } }];

  let combos = await getCombos(Combo, Model.find, query);
  const comboColumns = [{ combo: { className: 'text-sm font-bold' } }];

  return {
    props: {
      flatgroundTricksData: { flatgroundTricks, flatgroundColumns },
      grindsData: { grinds, grindColumns },
      manualsData: { manuals, manualColumns },
      combosData: { combos, comboColumns },
    },
  };
}

export default function Index({ flatgroundTricksData, grindsData, combosData, manualsData }) {
  const [flatgroundTricks, setFlatgroundTricks] = useState(flatgroundTricksData.flatgroundTricks);
  const [grinds, setGrinds] = useState(grindsData.grinds);
  const [combos, setCombos] = useState(combosData.combos);
  const [manuals, setManuals] = useState(manualsData.manuals);

  flatgroundTricksData.flatgroundActions = getCommonActions('flatgroundtricks');
  grindsData.grindActions = getCommonActions('grinds');
  manualsData.manualActions = getCommonActions('manuals');
  combosData.comboActions = getCommonActions('combos');

  const handleActions = async (action, obj, entityType) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          const dataMap = {
            'flatground trick': ['flatgroundtricks', setFlatgroundTricks],
            grind: ['grinds', setGrinds],
            manual: ['manuals', setManuals],
            combo: ['combos', setCombos],
          };

          const [endpoint, setData] = dataMap[entityType];

          if (!endpoint) throw new Error(`Invalid entity type: ${entityType}`);

          await apiCall(endpoint, { method: 'DELETE', id: obj._id });
          const { data } = await apiCall(endpoint, { method: 'GET' });
          setData(data);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Dashboard</h1>
        <p className="mt-3 text-center">This is a overview of all the tricks you've added to your account.</p>
      </div>
      <div className="flex flex-col">
        <LinkWithArrow label="Flatground Tricks" href="/flatgroundtricks" />
        <GenericTable
          objArray={flatgroundTricks}
          columns={flatgroundTricksData.flatgroundColumns}
          actions={flatgroundTricksData.flatgroundActions}
          onAction={handleActions}
          entityName="flatground trick"
          newLink="/new-flatground-trick"
          showCount
        />
      </div>

      <div className="flex flex-col">
        <LinkWithArrow label="Grinds" href="/grinds" />
        <GenericTable
          objArray={grinds}
          columns={grindsData.grindColumns}
          actions={grindsData.grindActions}
          onAction={handleActions}
          entityName="grind"
          newLink="/new-grind"
          showCount
        />
      </div>

      <div className="flex flex-col">
        <LinkWithArrow label="Manuals" href="/manuals" />
        <GenericTable
          objArray={manuals}
          columns={manualsData.manualColumns}
          actions={manualsData.manualActions}
          onAction={handleActions}
          entityName="manual"
          newLink={'/new-manual'}
          showCount
        />
      </div>

      <div className="flex flex-col">
        <LinkWithArrow label="Combos" href="/combos" />
        <GenericTable
          objArray={combos}
          columns={combosData.comboColumns}
          actions={combosData.comboActions}
          onAction={handleActions}
          entityName="combo"
          newLink="/new-combo"
          showCount
        />
      </div>
    </div>
  );
}
