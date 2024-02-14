import mongoose from 'mongoose';
import FlatgroundTrick from './FlatgroundTrick';
import Grind from './Grind';
import Manual from './Manual';
const { ObjectId } = mongoose.Schema.Types;

const TRICK_TYPES_ENUM = [FlatgroundTrick.modelName, Grind.modelName, Manual.modelName];

const ComboSchema = new mongoose.Schema(
  {
    trickArray: [
      {
        trick: {
          type: ObjectId,
          refPath: 'trickArray.trickRef',
        },
        trickRef: {
          type: String,
          enum: TRICK_TYPES_ENUM,
          default: FlatgroundTrick.modelName,
          required: true,
        },
      },
    ],
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true },
);

// ComboSchema.index({ userId: 1, 'trickArray.trick': 1 }, { unique: true }); // Does not work with arrays of nested documents

async function validation(next, self, context) {
  if (self.trickArray?.length < 2) next(new Error('Combo must consist of at least 2 tricks'));

  // Combo cannot have 2 flatground tricks in a row in the trickArray
  if (
    self.trickArray.some(
      (_, i, trickArray) =>
        trickArray[i]?.trickRef === FlatgroundTrick.modelName &&
        trickArray[i + 1]?.trickRef === FlatgroundTrick.modelName,
    )
  ) {
    next(new Error('Combo cannot have 2 flatground tricks in a row'));
  }

  const query = { userId: context.userId, _id: { $ne: context._id } };
  query['trickArray'] = { $size: self.trickArray.length };
  query['trickArray.trick'] = { $all: self.trickArray.map(({ trick }) => trick) };

  const combo = await mongoose.models.Combo.findOne(query).sort({ createdAt: -1 });

  // double check combo trickArray._id's against self trickArray._id's
  // Because $all check only checks for the presence of the elements in the array and not if there are any extra elements
  if (combo) {
    const comboTrickArrayIds = combo.trickArray.map(({ trick: trickId }) => trickId.toString());
    const selfTrickArrayIds = self.trickArray.map(({ trick: trickId }) => trickId.toString());
    if (comboTrickArrayIds.join() === selfTrickArrayIds.join()) {
      next(new Error('This combo already exists'));
    }
  }

  next();
}

ComboSchema.pre('validate', async function (next) {
  await validation(next, this, this);
});

ComboSchema.pre('findOneAndUpdate', async function (next) {
  await validation(next, this.getUpdate(), this.getQuery());
});

// ComboSchema.methods.toResource = function () {
//   return populateComboTrickName(this.toObject());
// };

export default mongoose.models.Combo || mongoose.model('Combo', ComboSchema);
