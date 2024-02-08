import dbConnect from '../../../lib/dbConnect';
import { getCombos } from '../../../lib/serverUtils';
import Combo from '../../../models/Combo';
import { isValidObjectId, Model } from 'mongoose';
import ComboDetails from '../../../components/cards/ComboDetails';

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!isValidObjectId(_id)) {
    return { props: { error: `${_id} is not a valid grind trick id...` } };
  }

  const combo = await getCombos(Combo, Model.findById, { _id });

  if (!combo) {
    return { notFound: true };
  }

  return { props: { combo } };
}

const ComboPage = ({ combo, error }) => {
  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <ComboDetails combo={combo} />
    </div>
  );
};

export default ComboPage;
