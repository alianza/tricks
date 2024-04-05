import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/_[...nextauth]';
import ProfileForm from '../../components/forms/ProfileForm';
import { ensureProfile, serialize } from '@/lib/serverUtils';
import dbConnect from '../../lib/dbConnect';

export async function getServerSideProps(context) {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);
  const query = { userId: session.user.id };

  const profile = serialize(await ensureProfile({ ...query }));

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
