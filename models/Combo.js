import mongoose from 'mongoose';
import FlatgroundTrick from './FlatgroundTrick';
import Grind from './Grind';

const TRICK_TYPES_ENUM = [FlatgroundTrick.modelName, Grind.modelName];

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
  },
  { timestamps: true }
);

// trickArray should have at least a length of 2
async function validation(next, self) {
  if (self.trickArray.length < 2) {
    next(new Error('Combo must consist of at least 2 tricks'));
  }
  next();
}

ComboSchema.pre('validate', async function (next) {
  await validation(next, this);
});
ComboSchema.pre('findOneAndUpdate', async function (next) {
  await validation(next, this.getUpdate());
});

// ComboSchema.methods.toResource = function () {
//   return populateComboTrickName(this.toObject());
// };

export default mongoose.models.Combo || mongoose.model('Combo', ComboSchema);
