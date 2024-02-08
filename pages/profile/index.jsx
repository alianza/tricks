import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import Profile from '../../models/Profile';
import findAndSerializeDoc from '../../lib/serverUtils';
import { Model } from 'mongoose';
import ProfileForm from '../../components/forms/profileForm';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const query = { userId: session.user.id };

  const profile = await findAndSerializeDoc(Profile, Model.findOneAndUpdate, query, {
    args: [{}, { new: true, upsert: true }],
  });

  return {
    props: {
      profile,
    },
  };
}

const ProfilePage = ({ profile }) => {
  const profileForm = {
    preferred_stance: profile.preferred_stance,
  };

  return <ProfileForm profileForm={profileForm} />;
};

export default ProfilePage;
