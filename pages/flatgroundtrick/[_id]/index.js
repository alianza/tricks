import dbConnect from "../../../lib/dbConnect";
import findAndSerializeDoc from "../../../lib/util";
import mongoose, { Model } from "mongoose";
import FlatgroundTrickCard from "../../../components/cards/flatgroundTrick/flatgroundTrickCard";
import FlatGroundTrick from "../../../models/FlatgroundTrick";

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { props: { error: "Not a valid flatground trick id" } };
  }

  const flatGroundTrick = await findAndSerializeDoc(FlatGroundTrick, Model.findById, { _id });

  if (!flatGroundTrick) {
    return { notFound: true };
  }

  return { props: { flatGroundTrick } };
}

/* Allows you to view trick card info and delete trick card*/
const flatGroundTrickPage = ({ flatGroundTrick, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <FlatgroundTrickCard flatGroundTrick={flatGroundTrick} mode="delete" />
    </div>
  );
};

export default flatGroundTrickPage;
