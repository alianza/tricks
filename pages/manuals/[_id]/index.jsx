import dbConnect from '../../../lib/dbConnect';
import { getTricks } from '../../../lib/serverUtils';
import Manual from '../../../models/Manual';
import { isValidObjectId, Model } from 'mongoose';
import ManualDetails from '../../../components/cards/ManualDetails';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid grind trick id...` } };
  }

  const manual = await getTricks(Manual, Model.findById, { _id });

  if (!manual) {
    return { notFound: true };
  }

  return { props: { manual } };
}

const ManualPage = ({ manual, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <ManualDetails manual={manual} />;
};

export default ManualPage;
