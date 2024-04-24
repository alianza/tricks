import dbConnect, { dbDisconnect } from '../../../lib/dbConnect';
import { getTricks, requireAuth } from '../../../lib/serverUtils';
import FlatgroundTrickDetails from '../../../components/cards/FlatgroundTrickDetails';
import FlatGroundTrick from '../../../models/FlatgroundTrick';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params, req, res }) {
  await dbConnect();

  const { _id } = params;
  if (!isValidObjectId(_id)) return { props: { error: `${_id} is not a valid flatground trick id...` } };

  const { authQuery } = await requireAuth(req, res);
  const flatgroundTrick = await getTricks(FlatGroundTrick, Model.findOne, { _id, ...authQuery });

  if (!flatgroundTrick) return { notFound: true };

  await dbDisconnect();

  return { props: { flatgroundTrick } };
}

const FlatgroundTrickPage = ({ flatgroundTrick, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <FlatgroundTrickDetails flatgroundTrick={flatgroundTrick} />;
};

export default FlatgroundTrickPage;
