import dbConnect from '../../../lib/dbConnect';
import { getTricks } from '../../../lib/serverUtils';
import GrindDetails from '../../../components/cards/GrindDetails';
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

const GrindPage = ({ grind, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <GrindDetails grind={grind} />;
};

export default GrindPage;
