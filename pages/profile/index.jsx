import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import ProfileForm from '../../components/forms/ProfileForm';
import { ensureProfile, serialize } from '../../lib/serverUtils';
import dbConnect from '../../lib/dbConnect';
import Loader from '../../components/common/loader/loader';

export async function getServerSideProps(context) {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);
  const query = { userId: session.user.id };

  const profile = serialize(await ensureProfile({ ...query }));

  if (!profile) return { notFound: true };

  return {
    props: {
      profile,
    },
  };
}

const ProfilePage = ({ profile }) => {
  if (!profile) return <Loader className="mx-auto my-24" />;

  const profileForm = {
    preferred_stance: profile.preferred_stance,
  };

  return <ProfileForm profileForm={profileForm} />;
};

export default ProfilePage;
