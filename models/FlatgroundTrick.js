import mongoose from 'mongoose';
import { FLATGROUND_TRICKS_ENUM } from './constants/flatgroundTricks';
import { PREFFERED_STANCES_ENUM, STANCES_ENUM } from './constants/stances';
import { getUpdate, updateDocLandedAt, updateQueryLandedAt } from './modelUtils';

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
      enum: PREFFERED_STANCES_ENUM,
    },
    stance: {
      type: String,
      required: [true, "Please provide the tricks' stance"],
      enum: STANCES_ENUM,
    },
    direction: {
      type: String,
      enum: ['none', 'frontside', 'backside'],
      validate: {
        validator: function (value) {
          return this.rotation === 0 || value !== 'none';
        },
        message: 'Must specify a direction if there is a rotation',
      },
    },
    rotation: {
      type: Number,
      enum: [0, 180, 360, 540, 720],
      validate: {
        validator: function (value) {
          return this.direction === 'none' || value !== 0;
        },
        message: 'Must specify a rotation if there is a direction',
      },
    },
    landed: {
      type: Boolean,
      default: false,
    },
    landedAt: {
      type: Date,
    },
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true },
);

FlatgroundTrickSchema.index({ userId: 1, name: 1, stance: 1, direction: 1, rotation: 1 }, { unique: true });

FlatgroundTrickSchema.pre('save', function (next) {
  updateDocLandedAt.call(this);

  next();
});

FlatgroundTrickSchema.pre('findOneAndUpdate', async function (next) {
  const { update, doc, updateObj } = await getUpdate.call(this);

  updateQueryLandedAt(update, doc, updateObj);

  if (Object.keys(updateObj).length === 0) return next();

  await this.clone().updateOne({ _id: doc._id }, updateObj);
  next();
});

export default mongoose.models.FlatgroundTrick || mongoose.model('FlatgroundTrick', FlatgroundTrickSchema);
