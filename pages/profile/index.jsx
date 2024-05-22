import ProfileForm from '../../components/forms/ProfileForm';
import Loader from '@/components/common/Loader';
import { useApiCall } from '../../lib/customHooks';

// For some reason doesn't work when navigating to /profile using router nav link
// export async function getServerSideProps(context) {
//   await dbConnect();
//
//   const session = await getServerSession(context.req, context.res, authOptions);
//   const query = { userId: session.user.id };
//
//   const profile = serialize(await ensureProfile({ ...query }));
//
//   if (!profile) return { notFound: true };
//
//   return {
//     props: {
//       profile,
//     },
//   };
// }

const ProfilePage = () => {
  const { data, error, loading } = useApiCall('profiles/mine', { method: 'GET' });
  const { data: profile, error: serverError } = data || {};

  if (error || serverError)
    return <p className="text-xl">Failed to load Profile: {(error || serverError).toString()}</p>;
  if (!profile || loading) return <Loader className="mx-auto my-24" />;

  const profileForm = {
    preferred_stance: profile.preferred_stance,
  };

  return <ProfileForm profileForm={profileForm} />;
};

export default ProfilePage;
