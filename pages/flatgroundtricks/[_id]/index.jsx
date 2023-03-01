import dbConnect from '../../../lib/dbConnect';
import findAndSerializeDoc from '../../../lib/util';
import FlatgroundTrickCard from '../../../components/cards/flatgroundTrickCard';
import FlatGroundTrick from '../../../models/FlatgroundTrick';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid flatground trick id...` } };
  }

  const flatgroundTrick = await findAndSerializeDoc({
    model: FlatGroundTrick,
    operation: Model.findById,
    query: { _id },
  });

  if (!flatgroundTrick) {
    return { notFound: true };
  }

  return { props: { flatgroundTrick } };
}

/* Allows you to view trick card info and delete trick card*/
const flatgroundTrickPage = ({ flatgroundTrick, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <FlatgroundTrickCard flatgroundTrick={flatgroundTrick} mode="delete" />
    </div>
  );
};

export default flatgroundTrickPage;
