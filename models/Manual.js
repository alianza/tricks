import mongoose from 'mongoose';
import { MANUALS_ENUM, MANUALS } from './constants/manuals.js';
import { PREFFERED_STANCES_ENUM, STANCES_ENUM } from './constants/stances';
import { getUpdate, updateDocLandedAt, updateQueryLandedAt } from './modelUtils';

const ManualSchema = new mongoose.Schema(
  {
    preferred_stance: {
      type: String,
      required: [true, 'Please provide your preferred stance'],
      enum: PREFFERED_STANCES_ENUM,
    },
    type: {
      type: String,
      required: [true, 'Please provide the type of manual'],
      enum: MANUALS_ENUM,
    },
    stance: {
      type: String, // Stance indicates the stance assumed while performing the manual, which is not necessarily the same as the stance before the manual
      enum: STANCES_ENUM, // This will be populated by the pre-save hook
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

ManualSchema.index({ userId: 1, type: 1 }, { unique: true });

ManualSchema.pre('save', function (next) {
  if (this.isModified('type')) {
    if (this.type === MANUALS.nose) {
      this.stance = 'nollie';
    }
    this.stance = this.type.split('-')[0];
  }

  updateDocLandedAt.call(this);

  next();
});

ManualSchema.pre('findOneAndUpdate', async function (next) {
  const { update, doc, updateObj } = await getUpdate.call(this);

  // Populate the stance field based on the type field
  if (update.type) {
    if (update.type === MANUALS.nose) {
      updateObj.stance = 'nollie';
    }
    updateObj.stance = update.type.split('-')[0];
  }

  updateQueryLandedAt(update, doc, updateObj);

  if (Object.keys(updateObj).length === 0) return next();

  await this.clone().updateOne({ _id: doc._id }, updateObj);

  next();
});

export default mongoose.models.Manual || mongoose.model('Manual', ManualSchema);
