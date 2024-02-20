const TRICK_TYPES = {
  flatground: 'flatground',
  manual: 'manual',
  grind: 'grind',
  combo: 'combo',
};

const TRICK_TYPES_ENUM = Object.values(TRICK_TYPES);

const DEFAULT_TRICK_TYPE = TRICK_TYPES.flatground;

const TRICK_TYPES_MODELS = {
  [TRICK_TYPES.flatground]: 'FlatgroundTrick',
  [TRICK_TYPES.grind]: 'Grind',
  [TRICK_TYPES.manual]: 'Manual',
  [TRICK_TYPES.combo]: 'Combo',
};

export { TRICK_TYPES_ENUM, TRICK_TYPES, DEFAULT_TRICK_TYPE, TRICK_TYPES_MODELS };

export default TRICK_TYPES;
