import dbConnect, { dbDisconnect } from '../../../lib/dbConnect';
import { getCombos, requireAuth } from '../../../lib/serverUtils';
import Combo from '../../../models/Combo';
import { isValidObjectId, Model } from 'mongoose';
import ComboDetails from '../../../components/cards/ComboDetails';

export async function getServerSideProps({ params, req, res }) {
  await dbConnect();

  const { _id } = params;
  if (!isValidObjectId(_id)) return { props: { error: `${_id} is not a valid grind trick id...` } };

  const { authQuery } = await requireAuth(req, res);
  const combo = await getCombos(Combo, Model.findOne, { _id, ...authQuery });

  if (!combo) return { notFound: true };

  await dbDisconnect();

  return { props: { combo } };
}

const ComboPage = ({ combo, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <ComboDetails combo={combo} />;
};

export default ComboPage;
