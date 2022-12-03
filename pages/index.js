import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import findAndSerializeDoc from "../lib/util";
import Pet from "../models/Pet";
import FlatGroundTrick from "../models/FlatGroundTrick";
import { Model } from "mongoose";
import PetCard from "../components/cards/pet/petCard";
import FlatGroundTrickCard from "../components/cards/flatGroundTrick/flatGroundTrickCard";

export async function getServerSideProps() {
  await dbConnect();

  const pets = await findAndSerializeDoc(Pet, Model.find, {});
  const flatGroundTricks = await findAndSerializeDoc(FlatGroundTrick, Model.find, {});

  return { props: { pets, flatGroundTricks } };
}

const Index = ({ pets, flatGroundTricks }) => {
  console.log(`flatGroundTricks`, flatGroundTricks);
  return (
    <>
      <div id="pets" className="flex flex-wrap gap-2">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} mode="view" />
        ))}
      </div>

      <div id="flat-ground-tricks" className="flex flex-wrap gap-2">
        {flatGroundTricks.map((flatGroundTrick) => (
          <FlatGroundTrickCard
            key={flatGroundTrick._id}
            flatGroundTrick={flatGroundTrick}
            mode="view"
          />
        ))}
      </div>
    </>
  );
};

export default Index;
