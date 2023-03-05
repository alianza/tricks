import Combo from '../../models/Combo';
import { SOrNoS } from '../../lib/util';

export const checkForUsedCombos = async ({ _id, trickType, res }) => {
  const combos = await Combo.countDocuments({ 'trickArray.trick': _id });

  if (combos) {
    return res.status(400).json({
      success: false,
      error: `This ${trickType} is used in ${combos} combo${SOrNoS(combos)}`,
    });
  }
};
