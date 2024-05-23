'use server';

import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/_[...nextauth]';
import FlatgroundTrick from '@/models/FlatgroundTrick';
import { getFullTrickName } from '@/lib/commonUtils';

export async function getMyFlatGroundTricks() {
  await dbConnect();
  let session = await getServerSession(authOptions);
  const authQuery = { userId: parseInt(session.user.id) };
  const flatgroundTricks = await FlatgroundTrick.find({ ...authQuery }).lean();
  return flatgroundTricks.map(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    trick: getFullTrickName(rest),
  }));
}
