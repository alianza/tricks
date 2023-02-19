import dbConnect from '../lib/dbConnect';
import findAndSerializeDoc from '../lib/util';
import FlatGroundTrick from '../models/FlatgroundTrick';
import Grind from '../models/Grind';
import { Model } from 'mongoose';
import FlatgroundTrickCard from '../components/cards/flatgroundTrickCard';
import GrindCard from '../components/cards/grindCard';

export async function getServerSideProps() {
  await dbConnect();

  const flatgroundTricks = await findAndSerializeDoc(FlatGroundTrick, Model.find, {});

  const grinds = await findAndSerializeDoc(Grind, Model.find, {});

  return { props: { flatgroundTricks, grinds } };
}

const Index = ({ flatgroundTricks, grinds }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center">
        <h1 className="mb-6 text-4xl">Flatground Tricks</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {flatgroundTricks.map((flatgroundTrick) => (
            <FlatgroundTrickCard key={flatgroundTrick._id} flatgroundTrick={flatgroundTrick} mode="view" />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="mb-6 text-4xl">Grinds</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {grinds.map((grind) => (
            <GrindCard key={grind._id} grind={grind} mode="view" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
