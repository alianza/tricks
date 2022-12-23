import dbConnect from "../lib/dbConnect";
import findAndSerializeDoc from "../lib/util";
import FlatGroundTrick from "../models/FlatgroundTrick";
import { Model } from "mongoose";
import FlatgroundTrickCard from "../components/cards/flatgroundTrick/flatgroundTrickCard";

export async function getServerSideProps() {
  await dbConnect();

  const flatGroundTricks = await findAndSerializeDoc(FlatGroundTrick, Model.find, {});

  return { props: { flatGroundTricks } };
}

const Index = ({ flatGroundTricks }) => {
  return (
    <div className="flex flex-col items-center gap-16">
      <h1 className="-mb-12 text-4xl">Flat Ground Tricks</h1>
      <div id="flat-ground-tricks" className="flex flex-wrap gap-2">
        {flatGroundTricks.map((flatGroundTrick) => (
          <FlatgroundTrickCard
            key={flatGroundTrick._id}
            flatGroundTrick={flatGroundTrick}
            mode="view"
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
