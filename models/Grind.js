import mongoose from 'mongoose';
import { GRINDS_ENUM } from './constants/grinds';
import { PREFFERED_STANCES_ENUM, STANCES_ENUM } from './constants/stances';
import { DIRECTIONS } from './constants/flatgroundTricks';
import { landedAtValidators } from './modelUtils';

const GrindSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this trick'],
      enum: {
        values: GRINDS_ENUM,
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
        values: [DIRECTIONS.frontside, DIRECTIONS.backside],
        message: '"{VALUE}" is not a valid direction',
      },
      required: [true, "Please provide the tricks' direction"],
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

GrindSchema.index({ userId: 1, name: 1, stance: 1, direction: 1 }, { unique: true });

// GrindSchema.pre('save', function (next) {
//   updateDocLandedAt.call(this);
//
//   next();
// });
//
// GrindSchema.pre('findOneAndUpdate', async function (next) {
//   const { update, doc, updateObj } = await getUpdate.call(this);
//
//   updateQueryLandedAt(update, doc, updateObj);
//
//   if (Object.keys(updateObj).length === 0) return next();
//
//   await this.clone().updateOne({ _id: doc._id }, updateObj);
//   next();
// });

export default mongoose.models?.Grind || mongoose.model('Grind', GrindSchema);
