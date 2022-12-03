import dbConnect from "../../../lib/dbConnect";
import Pet from "../../../models/Pet";
import findAndSerializeDoc from "../../../lib/util";
import mongoose, { Model } from "mongoose";
import PetCard from "../../../components/cards/pet/petCard";

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { props: { error: "Not a valid pet id" } };
  }

  const pet = await findAndSerializeDoc(Pet, Model.findById, { _id });

  if (!pet) {
    return { notFound: true };
  }

  return { props: { pet } };
}

/* Allows you to view pet card info and delete pet card*/
const PetPage = ({ pet, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <PetCard pet={pet} mode="delete" />
    </div>
  );
};

export default PetPage;
