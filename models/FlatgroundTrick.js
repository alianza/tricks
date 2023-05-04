import mongoose from 'mongoose';
import { FLATGROUND_TRICKS_ENUM } from './constants/flatgroundTricks';

const FlatgroundTrickSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this trick'],
      enum: FLATGROUND_TRICKS_ENUM,
    },
    preferred_stance: {
      type: String,
      required: [true, 'Please provide your preferred stance'],
      enum: ['regular', 'goofy'],
    },
    stance: {
      type: String,
      required: [true, "Please provide the tricks' stance"],
      enum: ['regular', 'fakie', 'switch', 'nollie'],
    },
    direction: {
      type: String,
      enum: ['none', 'frontside', 'backside'],
    },
    rotation: {
      type: Number,
      enum: [0, 180, 360, 540, 720],
    },
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true }
);

FlatgroundTrickSchema.index({ userId: 1, name: 1, stance: 1, direction: 1, rotation: 1 }, { unique: true });

async function validation(next, self) {
  if (self.direction === 'none' && parseInt(self.rotation, 10) !== 0) {
    next(new Error('Must specify a direction if there is a rotation'));
  }
  if (self.direction !== 'none' && parseInt(self.rotation, 10) === 0) {
    next(new Error('Must specify a rotation if there is a direction'));
  }
  next();
}

FlatgroundTrickSchema.pre('validate', async function (next) {
  await validation(next, this);
});

FlatgroundTrickSchema.pre('findOneAndUpdate', async function (next) {
  await validation(next, this.getUpdate());
});

export default mongoose.models.FlatgroundTrick || mongoose.model('FlatgroundTrick', FlatgroundTrickSchema);
