import mongoose from 'mongoose';
import { DIRECTIONS, FLATGROUND_TRICKS_ENUM } from './constants/flatgroundTricks';
import { PREFFERED_STANCES_ENUM, STANCES_ENUM } from './constants/stances';
import { landedAtValidators } from './modelUtils';

/**
 * FlatgroundTrick
 * @constructor FlatgroundTrickSchema
 */

const FlatgroundTrickSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this trick'],
      enum: {
        values: FLATGROUND_TRICKS_ENUM,
        message: '"{VALUE}" is not a valid trick name',
      },
    },
    preferred_stance: {
      type: String,
      required: [true, 'Please provide your preferred stance'],
      enum: {
        values: PREFFERED_STANCES_ENUM,
        message: '"{VALUE}" is not a valid preferred stance',
      },
    },
    stance: {
      type: String,
      required: [true, "Please provide the tricks' stance"],
      enum: {
        values: STANCES_ENUM,
        message: '"{VALUE}" is not a valid stance',
      },
    },
    direction: {
      type: String,
      enum: {
        values: [DIRECTIONS.none, DIRECTIONS.frontside, DIRECTIONS.backside],
        message: '"{VALUE}" is not a valid direction',
      },
      validate: {
        validator: function (value) {
          if (value === DIRECTIONS.none && this.rotation !== 0) return false;
        },
        message: 'Must specify a direction if there is a rotation',
      },
    },
    rotation: {
      type: Number,
      enum: {
        values: [0, 180, 360, 540, 720],
        message: '"{VALUE}" is not a valid rotation',
      },
      validate: {
        validator: function (value) {
          if (value === 0 && this.direction !== DIRECTIONS.none) return false;
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
      validate: landedAtValidators,
    },
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in and try again.'],
    },
  },
  { timestamps: true },
);

FlatgroundTrickSchema.index({ userId: 1, name: 1, stance: 1, direction: 1, rotation: 1 }, { unique: true });

// FlatgroundTrickSchema.pre('save', function (next) {
//   updateDocLandedAt.call(this);
//
//   next();
// });
//
// FlatgroundTrickSchema.pre('findOneAndUpdate', async function (next) {
//   const { update, doc, updateObj } = await getUpdate.call(this);
//
//   updateQueryLandedAt(update, doc, updateObj);
//
//   if (Object.keys(updateObj).length === 0) return next();
//
//   await this.clone().updateOne({ _id: doc._id }, updateObj);
//   next();
// });

export default mongoose.models.FlatgroundTrick || mongoose.model('FlatgroundTrick', FlatgroundTrickSchema);
