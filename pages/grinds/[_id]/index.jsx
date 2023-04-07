import dbConnect from '../../../lib/dbConnect';
import findAndSerializeDoc from '../../../lib/serverUtils';
import GrindCard from '../../../components/cards/grindCard';
import Grind from '../../../models/Grind';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid grind trick id...` } };
  }

  const grind = await findAndSerializeDoc({ model: Grind, operation: Model.findById, query: { _id } });

  if (!grind) {
    return { notFound: true };
  }

  return { props: { grind } };
}

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
