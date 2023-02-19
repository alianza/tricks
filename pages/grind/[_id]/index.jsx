import dbConnect from '../../../lib/dbConnect';
import findAndSerializeDoc from '../../../lib/util';
import mongoose, { Model } from 'mongoose';
import GrindCard from '../../../components/cards/grindCard';
import Grind from '../../../models/Grind';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { props: { error: 'Not a valid grind trick id' } };
  }

  const grind = await findAndSerializeDoc(Grind, Model.findById, { _id });

  if (!grind) {
    return { notFound: true };
  }

  return { props: { grind } };
}

/* Allows you to view trick card info and delete trick card*/
const grindPage = ({ grind, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <GrindCard grind={grind} mode="delete" />
    </div>
  );
};

export default grindPage;
