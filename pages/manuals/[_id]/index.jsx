import dbConnect from '../../../lib/dbConnect';
import { getTricks, requireAuth } from '../../../lib/serverUtils';
import Manual from '../../../models/Manual';
import { isValidObjectId, Model } from 'mongoose';
import ManualDetails from '../../../components/cards/ManualDetails';

export async function getServerSideProps({ params, req, res }) {
  await dbConnect();

  const { _id } = params;
  if (!isValidObjectId(_id)) return { props: { error: `${_id} is not a valid grind trick id...` } };

  const { authQuery } = await requireAuth(req, res);
  const manual = await getTricks(Manual, Model.findOne, { _id, ...authQuery });

  if (!manual) return { notFound: true };

  return { props: { manual } };
}

const ManualPage = ({ manual, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <ManualDetails manual={manual} />;
};

export default ManualPage;
