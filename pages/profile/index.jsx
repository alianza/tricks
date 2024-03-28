import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import ProfileForm from '../../components/forms/ProfileForm';
import { ensureProfile, serialize } from '../../lib/serverUtils';

export async function getServerSideProps(context) {
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
