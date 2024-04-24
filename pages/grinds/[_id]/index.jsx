import dbConnect, { dbDisconnect } from '../../../lib/dbConnect';
import { getTricks, requireAuth } from '../../../lib/serverUtils';
import GrindDetails from '../../../components/cards/GrindDetails';
import Grind from '../../../models/Grind';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params, req, res }) {
  await dbConnect();

  const { _id } = params;
  if (!isValidObjectId(_id)) return { props: { error: `${_id} is not a valid grind trick id...` } };

  const { authQuery } = await requireAuth(req, res);
  const grind = await getTricks(Grind, Model.findOne, { _id, ...authQuery });

  if (!grind) return { notFound: true };

  await dbDisconnect();

  return { props: { grind } };
}

const GrindPage = ({ grind, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <GrindDetails grind={grind} />;
};

export default GrindPage;
