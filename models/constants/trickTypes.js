const TRICK_TYPES = {
  flatground: 'flatground',
  manual: 'manual',
  grind: 'grind',
  combo: 'combo',
};

const TRICK_TYPES_ENUM = Object.values(TRICK_TYPES);

const DEFAULT_TRICK_TYPE = TRICK_TYPES.flatground;

export { TRICK_TYPES_ENUM, TRICK_TYPES, DEFAULT_TRICK_TYPE };

export default TRICK_TYPES;