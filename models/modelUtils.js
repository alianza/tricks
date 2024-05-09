/**
 * Get the update object, the query object, and the document object
 * @returns  {Object} { update, doc, updateObj, query }
 */
async function getUpdate() {
  const update = this.getUpdate();
  const query = this.getQuery();
  const doc = await this.clone().findOne(query);
  const updateObj = {};
  return { update, doc, updateObj, query };
}

/**
 * Update the landedAt field if the landed field is modified and is true for document middleware (call with .call(this))
 */
function updateDocLandedAt() {
  if (this.isModified('landed') && this.landed) {
    this.landedAt = new Date();
  }
}

/**
 * Update the landedAt field if the landed field is modified and is true for query middleware
 */
function updateQueryLandedAt(update, doc, updateObj) {
  if (update.landed && !doc.landed) {
    updateObj.landedAt = new Date();
  }
}

const landedAtValidators = [
  {
    validator: function (value) {
      if (!value && this.landed) return false;
    },
    message: 'Must specify a landing date if the trick is landed',
  },
  {
    validator: function (value) {
      if (value && !this.landed) return false;
    },
    message: 'Cannot specify a landing date if the trick is not landed',
  },
];

export { getUpdate, updateDocLandedAt, updateQueryLandedAt, landedAtValidators };
