const FLATGROUND_TRICKS = {
  ollie: 'ollie',
  shove_it: 'shove-it',
  kickflip: 'kickflip',
  heelflip: 'heelflip',
  varial_kickflip: 'varial kickflip',
  varial_heelflip: 'varial heelflip',
  hardflip: 'hardflip',
  inward_heelflip: 'inward heelflip',
};

const FLATGROUND_TRICKS_ENUM = Object.values(FLATGROUND_TRICKS);

const DEFAULT_FLATGROUND_TRICK = FLATGROUND_TRICKS.ollie;

export { FLATGROUND_TRICKS_ENUM, FLATGROUND_TRICKS, DEFAULT_FLATGROUND_TRICK };

export default FLATGROUND_TRICKS;
