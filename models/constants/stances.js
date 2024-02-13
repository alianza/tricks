const STANCES = {
  regular: 'regular',
  fakie: 'fakie',
  switch: 'switch',
  nollie: 'nollie',
};

const PREFFERED_STANCES = {
  regular: 'regular',
  goofy: 'goofy',
};

const PREFFERED_STANCES_ENUM = Object.values(PREFFERED_STANCES);

const DEFAULT_PREFFERED_STANCE = PREFFERED_STANCES.regular;

const STANCES_ENUM = Object.values(STANCES);

const DEFAULT_STANCE = STANCES.regular;

export { STANCES_ENUM, STANCES, DEFAULT_STANCE, PREFFERED_STANCES, PREFFERED_STANCES_ENUM, DEFAULT_PREFFERED_STANCE };

export default STANCES;
