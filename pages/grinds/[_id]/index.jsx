import dbConnect from '../../../lib/dbConnect';
import { getTricks } from '../../../lib/serverUtils';
import GrindDetails from '../../../components/cards/grindDetails';
import Grind from '../../../models/Grind';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid grind trick id...` } };
  }

  const grind = await getTricks(Grind, Model.findById, { _id });

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
      <GrindDetails grind={grind} />
    </div>
  );
};

export default grindPage;
