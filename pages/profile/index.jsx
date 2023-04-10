import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import Profile from '../../models/Profile';
import findAndSerializeDoc from '../../lib/serverUtils';
import { Model } from 'mongoose';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const profile = await findAndSerializeDoc({
    model: Profile,
    operation: Model.findOneAndUpdate,
    query: { userId: session.user.id },
    options: [{}, { new: true, upsert: true }],
  });

  return {
    props: {
      profile,
    },
  };
}

const profilePage = ({ profile }) => {
  console.log(`profile`, profile);
  return <div>

  </div>;
};

export default profilePage;
