import { trickCol } from '@/lib/clientUtils';
import TableSection from '@/appComponents/TableSection';

export default function Index({}) {
  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Dashboard</h1>
        <p className="mt-3 text-center">This is a overview of all the tricks you've added to your account.</p>
      </div>

      <TableSection
        title="Flatground Tricks"
        endpoint="flatgroundtricks"
        columns={['stance', 'direction', 'rotation', 'name', trickCol]}
        newLink="/new-flatground-trick"
        entityName="flatground trick"
      />

      <TableSection
        title="Grinds"
        endpoint="grinds"
        columns={['stance', 'direction', 'name', trickCol]}
        newLink="/new-grind"
        entityName="grind"
      />

      <TableSection
        title="Manuals"
        endpoint="manuals"
        columns={[{ type: { className: 'text-sm font-bold' } }]}
        newLink="/new-manual"
        entityName="manual"
      />

      <TableSection
        title="Combos"
        endpoint="combos"
        columns={[{ trick: { className: 'text-sm font-bold', alias: 'Combo name' } }]}
        newLink="/new-combo"
        entityName="combo"
      />
    </div>
  );
}
