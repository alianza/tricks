const FLATGROUND_TRICKS = {
  ollie: 'ollie',
  shove_it: 'shove-it',
  kickflip: 'kickflip',
  heelflip: 'heelflip',
  varial_kickflip: 'varial kickflip',
  varial_heelflip: 'varial heelflip',
  hardflip: 'hardflip',
  inward_heelflip: 'inward heelflip',
  tre_flip: '360 flip',
  lazer_flip: 'lazer flip',
};

const DIRECTIONS = {
  none: 'none',
  frontside: 'frontside',
  backside: 'backside',
};

const DIRECTIONS_ENUM = Object.values(DIRECTIONS);

const FLATGROUND_TRICKS_ENUM = Object.values(FLATGROUND_TRICKS);

const DEFAULT_FLATGROUND_TRICK = FLATGROUND_TRICKS.ollie;

export { FLATGROUND_TRICKS_ENUM, FLATGROUND_TRICKS, DEFAULT_FLATGROUND_TRICK, DIRECTIONS, DIRECTIONS_ENUM };

export default FLATGROUND_TRICKS;
