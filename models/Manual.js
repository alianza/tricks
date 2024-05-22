import mongoose from 'mongoose';
import { MANUALS_ENUM, MANUALS } from './constants/manuals.js';
import { PREFFERED_STANCES_ENUM, STANCES_ENUM } from './constants/stances';
import { getUpdate, landedAtValidators } from './modelUtils';

const ManualSchema = new mongoose.Schema(
  {
    preferred_stance: {
      type: String,
      required: [true, 'Please provide your preferred stance'],
      enum: {
        values: PREFFERED_STANCES_ENUM,
        message: '"{VALUE}" is not a valid preferred stance',
      },
    },
    type: {
      type: String,
      required: [true, 'Please provide the type of manual'],
      enum: {
        values: MANUALS_ENUM,
        message: '"{VALUE}" is not a valid manual type',
      },
    },
    stance: {
      type: String, // Stance indicates the stance assumed while performing the manual, which is not necessarily the same as the stance before the manual
      enum: {
        values: STANCES_ENUM,
        message: '"{VALUE}" is not a valid stance',
      }, // This will be populated by the pre-save hook
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

ManualSchema.index({ userId: 1, type: 1 }, { unique: true });

ManualSchema.pre('save', function (next) {
  // Populate the stance field based on the type field
  if (this.isModified('type')) {
    if (this.type === MANUALS.nose) {
      this.stance = 'nollie';
    }
    this.stance = this.type.split('-')[0];
  }

  // updateDocLandedAt.call(this);

  next();
});

ManualSchema.pre('findOneAndUpdate', async function (next) {
  const {
    update,
    doc: { _id },
    updateObj,
  } = await getUpdate.call(this);

  // Populate the stance field based on the type field
  if (update.type) {
    if (update.type === MANUALS.nose) {
      updateObj.stance = 'nollie';
    }
    updateObj.stance = update.type.split('-')[0];
  }

  // updateQueryLandedAt(update, doc, updateObj);

  if (Object.keys(updateObj).length === 0) return next();

  await this.clone().updateOne({ _id }, updateObj);

  next();
});

export default mongoose.models?.Manual || mongoose.model('Manual', ManualSchema);
