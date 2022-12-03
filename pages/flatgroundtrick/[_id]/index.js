import dbConnect from "../../../lib/dbConnect";
import findAndSerializeDoc from "../../../lib/util";
import mongoose, { Model } from "mongoose";
import FlatGroundTrickCard from "../../../components/cards/flatGroundTrick/flatGroundTrickCard";
import FlatGroundTrick from "../../../models/FlatGroundTrick";

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { props: { error: "Not a valid pet flatground trick id" } };
  }

  const flatGroundTrick = await findAndSerializeDoc(FlatGroundTrick, Model.findById, { _id });

  if (!flatGroundTrick) {
    return { notFound: true };
  }

  return { props: { flatGroundTrick } };
}

/* Allows you to view pet card info and delete pet card*/
const flatGroundTrickPage = ({ flatGroundTrick, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <FlatGroundTrickCard flatGroundTrick={flatGroundTrick} mode="delete" />
    </div>
  );
};

export default flatGroundTrickPage;
