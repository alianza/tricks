import dbConnect from '../../../lib/dbConnect';
import findAndSerializeDoc from '../../../lib/util';
import Combo from '../../../models/Combo';
import { isValidObjectId, Model } from 'mongoose';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid grind trick id...` } };
  }

  const combo = await findAndSerializeDoc({ model: Combo, operation: Model.findById, query: { _id } });

  if (!combo) {
    return { notFound: true };
  }

  return { props: { combo } };
}

/* Allows you to view trick card info and delete trick card*/
const grindPage = ({ combo, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return <div className="flex w-full justify-center">{JSON.stringify(combo)}</div>;
};

export default grindPage;
