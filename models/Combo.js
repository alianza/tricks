import mongoose from 'mongoose';
import FlatgroundTrick from './FlatgroundTrick';
import Grind from './Grind';
import Manual from './Manual';

const TRICK_TYPES_ENUM = [FlatgroundTrick.modelName, Grind.modelName, Manual.modelName];

const ComboSchema = new mongoose.Schema(
  {
    trickArray: [
      {
        trick: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'trickArray.trickRef',
        },
        trickRef: {
          type: String,
          enum: TRICK_TYPES_ENUM,
          default: TRICK_TYPES_ENUM[0],
          required: true,
        },
      },
    ],
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true }
);

// ComboSchema.index({ userId: 1, 'trickArray.trick': 1 }, { unique: true }); // Does not work with arrays of nested documents

async function validation(next, self, context) {
  if (self.trickArray.length < 2) next(new Error('Combo must consist of at least 2 tricks'));

  // 2 implementations of context for validate and findOneAndUpdate hooks
  if (context?.getQuery) context = context.getQuery();

  const query = { userId: context.userId, _id: { $ne: context._id } };
  query['trickArray'] = { $size: self.trickArray.length };
  query['trickArray.trick'] = { $all: self.trickArray.map(({ trick }) => trick) };

  const combo = await mongoose.models.Combo.findOne(query).limit(2);
  if (combo) next(new Error('This combo already exists'));

  next();
}

ComboSchema.pre('validate', async function (next) {
  await validation(next, this, this);
});

ComboSchema.pre('findOneAndUpdate', async function (next) {
  await validation(next, this.getUpdate(), this);
});

// ComboSchema.methods.toResource = function () {
//   return populateComboTrickName(this.toObject());
// };

export default mongoose.models.Combo || mongoose.model('Combo', ComboSchema);
