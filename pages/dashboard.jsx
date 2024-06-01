import LinkWithArrow from '../components/common/LinkWithArrow';
import GenericTable from '../components/common/genericTable/GenericTable';
import { apiCall, baseStyle, getCommonActions, hiddenStyle, landedAtCol, trickCol } from '../lib/clientUtils';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useAsyncEffect } from '../lib/customHooks';
import TransitionScroll from 'react-transition-scroll';

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
//       flatgroundTricksData: { flatgroundTricks, flatgroundColumns },
//       grindsData: { grinds, grindColumns },
//       manualsData: { manuals, manualColumns },
//       combosData: { combos, comboColumns },
//     },
//   };
// }

export default function Index() {
  const [flatgroundTricks, setFlatgroundTricks] = useState({ data: null, count: 0 });
  const [grinds, setGrinds] = useState({ data: null, count: 0 });
  const [manuals, setManuals] = useState({ data: null, count: 0 });
  const [combos, setCombos] = useState({ data: null, count: 0 });

  useAsyncEffect(async () => {
    const fetchAndSetData = async (endpoint, setData) => {
      try {
        const searchParams = new URLSearchParams({ landed: 'true' });
        const { data } = await apiCall(`${endpoint}`, { method: 'GET', searchParams });
        setData((prevData) => ({ ...prevData, data }));
      } catch (error) {
        toast.error(`Failed to fetch ${endpoint}: ${error.message}`);
      }
    };

    const fetchAndSetCount = async (endpoint, setData) => {
      try {
        const searchParams = new URLSearchParams({ countOnly: 'true' });
        const { data } = await apiCall(`${endpoint}`, { method: 'GET', searchParams });
        setData((prevData) => ({ ...prevData, count: data }));
      } catch (error) {
        toast.error(`Failed to fetch total ${endpoint} count: ${error.message}`);
      }
    };

    const trickTypesAndSetters = [
      ['flatgroundtricks', setFlatgroundTricks],
      ['grinds', setGrinds],
      ['manuals', setManuals],
      ['combos', setCombos],
    ];

    (() =>
      trickTypesAndSetters.forEach(([endpoint, setData]) => {
        fetchAndSetData(endpoint, setData);
        fetchAndSetCount(endpoint, setData);
      }))();
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
          const searchParams = new URLSearchParams({ landed: 'true' });
          await apiCall(endpoint, { method: 'DELETE', id: obj._id });
          const { data } = await apiCall(`${endpoint}`, { method: 'GET', searchParams });
          setData((prevData) => ({ ...prevData, data }));
          toast.success(`Successfully deleted ${obj.trick}`);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
    }
  };

  const formatAdditionalInfo = (count, data) => (count !== 0 && count !== data?.length ? count + ' total' : '');

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-center text-5xl">Dashboard</h1>
        <p className="mt-3 text-center">This is an overview of all the landed tricks you've added to your account.</p>
      </div>
      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <LinkWithArrow label="Flatground Tricks" href="/flatgroundtricks" />
        <GenericTable
          objArray={flatgroundTricks.data}
          columns={[trickCol, landedAtCol]}
          actions={getCommonActions('flatgroundtricks')}
          onAction={handleActions}
          entityName="flatground trick"
          newLink="/new-flatground-trick"
          showCount
          showCountPrefix="Landed"
          defaultSortColumnIndex={1}
          defaultSortDirection="desc"
          additionalInfo={formatAdditionalInfo(flatgroundTricks.count, flatgroundTricks.data)}
          additionalInfoLink="/flatgroundtricks"
          enablePagination
        />
      </TransitionScroll>

      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <LinkWithArrow label="Grinds" href="/grinds" />
        <GenericTable
          objArray={grinds.data}
          columns={[trickCol, landedAtCol]}
          actions={getCommonActions('grinds')}
          onAction={handleActions}
          entityName="grind"
          newLink="/new-grind"
          showCount
          showCountPrefix="Landed"
          defaultSortColumnIndex={1}
          defaultSortDirection="desc"
          additionalInfo={formatAdditionalInfo(grinds.count, grinds.data)}
          additionalInfoLink="/grinds"
          enablePagination
        />
      </TransitionScroll>

      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <LinkWithArrow label="Manuals" href="/manuals" />
        <GenericTable
          objArray={manuals.data}
          columns={[{ type: { className: 'text-sm font-bold' } }, landedAtCol]}
          actions={getCommonActions('manuals')}
          onAction={handleActions}
          entityName="manual"
          newLink={'/new-manual'}
          showCount
          showCountPrefix="Landed"
          defaultSortColumnIndex={1}
          defaultSortDirection="desc"
          additionalInfo={formatAdditionalInfo(manuals.count, manuals.data)}
          additionalInfoLink="/manuals"
          enablePagination
        />
      </TransitionScroll>

      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <LinkWithArrow label="Combos" href="/combos" />
        <GenericTable
          objArray={combos.data}
          columns={[{ ...trickCol, trick: { ...trickCol.trick, alias: 'Combo Name' } }, landedAtCol]}
          actions={getCommonActions('combos')}
          onAction={handleActions}
          entityName="combo"
          newLink="/new-combo"
          showCount
          showCountPrefix="Landed"
          defaultSortColumnIndex={1}
          defaultSortDirection="desc"
          additionalInfo={formatAdditionalInfo(combos.count, combos.data)}
          additionalInfoLink="/combos"
          enablePagination
        />
      </TransitionScroll>
    </div>
  );
}
