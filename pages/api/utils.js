import Combo from '../../models/Combo';
import { sOrNoS } from '../../lib/util';
import { getServerSession } from 'next-auth';

export const checkForUsedCombos = async ({ _id, trickType, res }) => {
  const combos = await Combo.countDocuments({ 'trickArray.trick': _id });

  if (combos) {
    return res.status(400).json({
      success: false,
      error: `This ${trickType} is used in ${combos} combo${sOrNoS(combos)}`,
    });
  }
};

async function loginBarrier(context, authOptions) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}
