import mongoose from 'mongoose';
import { FLATGROUND_TRICKS_ENUM } from './constants/flatgroundTricks';

const FlatgroundTrickSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this trick'],
      enum: FLATGROUND_TRICKS_ENUM,
      // enum: { values: FLATGROUND_TRICKS, message: 'Provided name is not a valid trick name' }, // custom error message
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
    date: { type: Date, default: Date.now },
    link: { type: String },
    image_url: { type: String },
    location: { longitude: { type: Number }, latitude: { type: Number } },
  },
  { timestamps: true }
);

async function validation(next, self) {
  if (self.direction === 'none' && self.rotation !== 0) {
    next(new Error('Must specify a direction if there is a rotation'));
  }
  if (self.direction !== 'none' && self.rotation === 0) {
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

FlatgroundTrickSchema.methods.getName = function () {
  const partRemovalCondition = (part) => part !== 'none' || part !== 'regular' || part !== 0;
  const parts = [this.stance, this.direction, this.rotation, this.name];
  return parts.filter(partRemovalCondition).join(' ');
};

FlatgroundTrickSchema.methods.toResource = function () {
  return {
    ...this,
    id: this._id.toString(),
    name: this.getName(),
  };
};

export default mongoose.models.FlatgroundTrick || mongoose.model('FlatgroundTrick', FlatgroundTrickSchema);
