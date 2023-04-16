import dbConnect from '../../../lib/dbConnect';
import { getTricks } from '../../../lib/serverUtils';
import FlatgroundTrickDetails from '../../../components/cards/flatgroundTrickDetails';
import FlatGroundTrick from '../../../models/FlatgroundTrick';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid flatground trick id...` } };
  }

  const flatgroundTrick = await getTricks(FlatGroundTrick, Model.findById, { _id });

  if (!flatgroundTrick) {
    return { notFound: true };
  }

  return { props: { flatgroundTrick } };
}

const flatgroundTrickPage = ({ flatgroundTrick, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <FlatgroundTrickDetails flatgroundTrick={flatgroundTrick} />
    </div>
  );
};

export default flatgroundTrickPage;
