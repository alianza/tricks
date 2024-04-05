import { trickCol } from '@/lib/clientUtils';
import TableSection from '@/appComponents/TableSection';

export default function FlatgroundTricksPage() {
  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Flatground Tricks</h1>
        <p className="mt-3 text-center">
          This is a overview of all the flatground tricks you've added to your account.
        </p>
      </div>

      <TableSection
        title="Flatground Tricks"
        endpoint="flatgroundtricks"
        columns={['stance', 'direction', 'rotation', 'name', trickCol]}
        newLink="/new-flatground-trick"
        entityName="flatground trick"
      />
    </div>
  );
}
