import LinkWithArrow from '../components/common/LinkWithArrow';
import GenericTable from '../components/common/genericTable/genericTable';
import { apiCall, getCommonActions, trickCol } from '../lib/clientUtils';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useAsyncEffect } from '../lib/customHooks';

// export async function getServerSideProps(context) {
//   await dbConnect();
//
//   const session = await getServerSession(context.req, context.res, authOptions);
//   const query = { userId: session.user.id };
//
//   // const flatgroundTricks = await getTricks(FlatGroundTrick, Model.find, query);
//   const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', trickCol];
//
//   // const grinds = await getTricks(Grind, Model.find, query);
//   const grindColumns = ['stance', 'direction', 'name', trickCol];
//
//   // const manuals = await getTricks(Manual, Model.find, query);
//   const manualColumns = [{ type: { className: 'text-sm font-bold' } }];
//
//   // let combos = await getCombos(Combo, Model.find, query);
//   const comboColumns = [{ combo: { className: 'text-sm font-bold' } }];
//
//   return {
//     props: {
//       flatgroundTricksData: { flatgroundColumns },
//       grindsData: { grindColumns },
//       manualsData: { manualColumns },
//       combosData: { comboColumns },
//     },
//   };
// }

export default function Index({ flatgroundTricksData = {}, grindsData = {}, combosData = {}, manualsData = {} }) {
  const [flatgroundTricks, setFlatgroundTricks] = useState(null);
  const [grinds, setGrinds] = useState(null);
  const [manuals, setManuals] = useState(null);
  const [combos, setCombos] = useState(null);

  flatgroundTricksData.flatgroundActions = getCommonActions('flatgroundtricks');
  grindsData.grindActions = getCommonActions('grinds');
  manualsData.manualActions = getCommonActions('manuals');
  combosData.comboActions = getCommonActions('combos');

  flatgroundTricksData.flatgroundColumns = ['stance', 'direction', 'rotation', 'name', trickCol];
  grindsData.grindColumns = ['stance', 'direction', 'name', trickCol];
  manualsData.manualColumns = [{ type: { className: 'text-sm font-bold' } }];
  combosData.comboColumns = [{ combo: { className: 'text-sm font-bold' } }];

  // Client-side fetch
  useAsyncEffect(async () => {
    try {
      const trickTypes = ['flatgroundtricks', 'grinds', 'manuals', 'combos'];
      const promises = trickTypes.map((type) => apiCall(type, { method: 'GET' }));
      const [flatgroundTricks, grinds, manuals, combos] = await Promise.allSettled(promises);
      setFlatgroundTricks(flatgroundTricks.value?.data);
      setGrinds(grinds.value?.data);
      setManuals(manuals.value?.data);
      setCombos(combos.value?.data);
      [flatgroundTricks, grinds, manuals, combos].forEach(({ status, reason }) => {
        if (status === 'rejected') throw new Error(`Failed to fetch ${trickTypes.shift()} ${reason}`);
      });
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const handleActions = async (action, obj, entityType) => {
    const endpointSetterMap = {
      'flatground trick': ['flatgroundtricks', setFlatgroundTricks],
      grind: ['grinds', setGrinds],
      manual: ['manuals', setManuals],
      combo: ['combos', setCombos],
    };

    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          const [endpoint, setData] = endpointSetterMap[entityType];
          if (!endpoint) return toast.error(`Failed to delete ${obj.trick}: Invalid entity type: ${entityType}`);
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
